import { EditMessageRequest, SendGroupMessageRequest } from '@/types/message';
import SockJS from 'sockjs-client'
import { Client, IMessage } from '@stomp/stompjs'
import { Message, GroupMessage, User, Group, Reaction, MessageType, SendMessageRequest, ChatReaction, SocketResponse } from '@/types'
import { apiClient, API_CONFIG, SOCKET_EVENTS } from '@/api';
import { API_ENDPOINTS } from '@/api';


class SocketService {
    public stompClient: Client
    private onlineUsers: Set<number> = new Set()
    private onlineUserListeners: ((users: Set<number>) => void)[] = []
    private messageListeners: ((message: Message) => void)[] = []
    private groupMessageListeners: ((message: GroupMessage) => void)[] = []
    private reactionListeners: ((message: Message) => void)[] = []
    private messageDeletionListeners: ((id: number) => void)[] = []
    private messageEditionListeners: ((message: Message) => void)[] = []
    private logoutListeners: (() => void)[] = []
    private connectionAttempts: number = 0
    private maxConnectionAttempts: number = 3
    private systemMetricsListeners: ((metrics: Record<string, unknown>) => void)[] = []

    constructor() {
        this.stompClient = new Client({
            webSocketFactory: () => {
                try {
                    const token = localStorage.getItem("access_token")
                    if (!token) {
                        this.logout()
                        throw new Error('Missing access token')
                    }
                    const wsUrl = `${API_CONFIG.BASE_URL}/api/${API_CONFIG.API_VERSION}/ws?token=${encodeURIComponent(token)}`
                    return new SockJS(wsUrl, null, {
                        transports: ['websocket', 'xhr-polling', 'eventsource'],
                        timeout: 10000,
                        heartbeat: { outgoing: 10000, incoming: 10000 }
                    })
                } catch (error) {
                    console.error('Failed to initialize WebSocket factory:', error.message)
                    this.logout()
                    throw error // Prevent client activation
                }
            },
            reconnectDelay: 3000,
            onConnect: () => {
                try {
                    this.connectionAttempts = 0 // Reset attempts
                    this.subscribeToPublic()
                } catch (error) {
                    console.error('Error in onConnect handler:', error.message)
                }
            },
            onStompError: (frame) => {
                try {
                    if (
                        frame.headers['message']?.includes('Unauthorized') ||
                        frame.body?.includes('401') ||
                        frame.headers['message']?.includes('token')
                    ) {
                        console.warn('Unauthorized error detected, attempting token refresh')
                        this.handleUnauthorized()
                    } else {
                        this.handleConnectionError(new Error(`STOMP error: ${frame.headers['message']}`))
                    }
                } catch (error) {
                    console.error('Error handling STOMP error:', error.message)
                }
            },
            onWebSocketError: (error) => {
                try {
                    if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
                        console.warn('WebSocket 401 error, attempting token refresh')
                        this.handleUnauthorized()
                    } else {
                        this.handleConnectionError(error)
                    }
                } catch (err) {
                    console.error('Error handling WebSocket error:', err.message)
                }
            }
        })
    }

    private async handleUnauthorized() {
        try {
            if (this.connectionAttempts >= this.maxConnectionAttempts) {
                this.logout()
                return
            }
            this.connectionAttempts++
            const refreshToken = localStorage.getItem("refresh_token")
            if (!refreshToken) {
                throw new Error('No refresh token available')
            }
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/${API_CONFIG.API_VERSION}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            })

            if (response.ok) {
                const data = await response.json()
                localStorage.setItem("access_token", data.accessToken)
                await this.stompClient.deactivate()
                this.stompClient.activate()
                this.connectionAttempts = 0
            } else {
                throw new Error('Refresh token invalid or expired')
            }
        } catch (error) {
            console.error('Failed to refresh token:', error.message)
            this.logout()
        }
    }

    private handleConnectionError(error: Error) {
        try {
            if (this.connectionAttempts < this.maxConnectionAttempts) {
                this.connectionAttempts++
                setTimeout(() => {
                    this.stompClient.activate()
                }, 2000 * this.connectionAttempts)
            } else {
                this.logout()
            }
        } catch (err) {
            console.error('Error in connection error handler:', err.message)
            this.logout()
        }
    }

    public async logout() {
        try {
            localStorage.clear()
            await this.stompClient.deactivate()
            this.onlineUsers = new Set()
            this.onlineUserListeners.forEach((callback) => {
                try {
                    callback(new Set())
                } catch (error) {
                    console.error('Error in online users callback:', error.message)
                }
            })
            this.logoutListeners.forEach((callback) => {
                try {
                    callback()
                } catch (error) {
                    console.error('Error in logout callback:', error.message)
                }
            })
        } catch (error) {
            console.error('Error during logout:', error.message)
        } finally {
            this.logoutListeners.forEach((callback) => {
                try {
                    callback()
                } catch (error) {
                    console.error('Error in final logout callback:', error.message)
                }
            })
        }
    }

    public onLogout(callback: () => void) {
        try {
            this.logoutListeners.push(callback)
        } catch (error) {
            console.error('Error adding logout listener:', error.message)
        }
    }

    public removeLogoutListener(callback: () => void) {
        try {
            this.logoutListeners = this.logoutListeners.filter(cb => cb !== callback)
        } catch (error) {
            console.error('Error removing logout listener:', error.message)
        }
    }

    public connect() {
        try {
            const token = localStorage.getItem("access_token")
            if (!token) {
                this.logout()
                return
            }
            this.stompClient.activate()
        } catch (error) {
            console.error('Error connecting to WebSocket:', error.message)
            this.handleConnectionError(error)
        }
    }

    public async disconnect() {
        try {
            await this.stompClient.deactivate()
            this.onlineUsers = new Set()
            this.onlineUserListeners.forEach((callback) => {
                try {
                    callback(new Set())
                } catch (error) {
                    console.error('Error in online users callback:', error.message)
                }
            })
        } catch (error) {
            console.error('Error disconnecting WebSocket:', error.message)
        }
    }

    public isConnected(): boolean {
        return this.stompClient?.connected || false
    }

    private subscribeToPublic() {
        try {
            this.stompClient.subscribe('/topic/onlineUsers', (message) => this.handleOnlineUsers(message))
            this.stompClient.subscribe('/topic/messages', (message) => this.handleMessage(message))
            this.stompClient.subscribe('/topic/reactions', (message) => this.handleReaction(message))
            this.stompClient.subscribe('/topic/groupMessages', (message) => this.handleGroupMessage(message))
            this.stompClient.subscribe('/topic/systemMetrics', (message) => this.handleSystemMetrics(message))
            this.stompClient.subscribe('/topic/messageDeletion', (message) => this.handleMessageDeletion(message))
            this.stompClient.subscribe('/topic/messageEdition', (message) => this.handleMessageEdition(message))
        } catch (error) {
            console.error('❌ Error subscribing to public topics:', error.message)
        }
    }

    private handleMessageDeletion(message: IMessage) {
        try {
            const body = JSON.parse(message.body) as SocketResponse<number>
            this.messageDeletionListeners.forEach((callback) => {
                callback(body.data)
            })
        } catch (error) {
            console.error('error receiving deleted message', error)
        }
    }

    private handleMessageEdition(message: IMessage) {
        try {
            const body = JSON.parse(message.body) as SocketResponse<Message>
            this.messageEditionListeners.forEach((callback) => {
                callback(body.data)
            })
        } catch (error) {
            console.error('error receiving edited message', error)
        }
    }

    private handleReaction(message: IMessage) {
        try {
            const body = JSON.parse(message.body) as SocketResponse<Message>
            this.reactionListeners.forEach((callback) => {
                try {
                    callback(body.data)
                } catch (error) {
                    console.error('Error in reaction callback:', error.message)
                }
            })
        } catch (error) {
            console.error('Failed to parse reaction:', error.message)
        }
    }

    private handleMessage(message: IMessage) {
        try {
            const body = JSON.parse(message.body) as SocketResponse<Message>
            this.messageListeners.forEach((callback) => {
                try {
                    callback(body.data)
                } catch (error) {
                    console.error('Error in message callback:', error.message)
                }
            })
        } catch (error) {
            console.error('Failed to parse message:', error.message)
        }
    }

    private handleOnlineUsers(message: IMessage) {
        try {
            const userIds = JSON.parse(message.body) as number[]
            const users = new Set<number>(userIds)
            this.onlineUsers = users
            this.onlineUserListeners.forEach((callback) => {
                try {
                    callback(users)
                } catch (error) {
                    console.error('Error in online users callback:', error.message)
                }
            })
        } catch (error) {
            console.error('Failed to parse online user IDs:', error.message)
        }
    }

    private handleGroupMessage(message: IMessage) {
        try {
            const body = JSON.parse(message.body) as SocketResponse<GroupMessage>
            this.groupMessageListeners.forEach((callback) => {
                try {
                    callback(body.data)
                } catch (error) {
                    console.error('Error in group message callback:', error.message)
                }
            })
        } catch (error) {
            console.error('Failed to parse group message:', error.message)
        }
    }

    private handleSystemMetrics(message: IMessage) {
        try {
            const data = JSON.parse(message.body) as Record<string, unknown>
            this.systemMetricsListeners.forEach((callback) => {
                try {
                    callback(data)
                } catch (error) {
                    console.error('Error in system metrics callback:', error.message)
                }
            })
        } catch (error) {
            console.error('Failed to parse system metrics:', error.message)
        }
    }

    public sendMessage(data: SendMessageRequest) {
        try {
            if (!this.stompClient.connected) {
                console.warn('Cannot send message: WebSocket not connected')
                return
            }
            const payload = data
            this.stompClient.publish({
                destination: SOCKET_EVENTS.MESSAGE.SEND_MESSAGE,
                body: JSON.stringify(payload),
            })
        } catch (error) {
            console.error('Error sending message:', error.message)
            if (error.message?.includes('Unauthorized') || error.message?.includes('401')) {
                this.handleUnauthorized()
            }
        }
    }

    public messageReply(data: SendMessageRequest) {
        try {
            if (!this.stompClient.connected) {
                console.warn('Cannot send message: WebSocket not connected')
                return
            }
            const payload = data
            this.stompClient.publish({
                destination: SOCKET_EVENTS.MESSAGE.REPLY_MESSAGE,
                body: JSON.stringify(payload),
            })
        } catch (error) {
            console.error('Error sending message:', error.message)
            if (error.message?.includes('Unauthorized') || error.message?.includes('401')) {
                this.handleUnauthorized()
            }
        }
    }

    public messageReact(data: ChatReaction) {
        try {
            if (!this.stompClient.connected) {
                console.warn('Cannot send message: WebSocket not connected')
                return
            }
            const payload = data
            this.stompClient.publish({
                destination: SOCKET_EVENTS.MESSAGE.REACT_MESSAGE,
                body: JSON.stringify(payload),
            })
        } catch (error) {
            console.error('Error sending message:', error.message)
            if (error.message?.includes('Unauthorized') || error.message?.includes('401')) {
                this.handleUnauthorized()
            }
        }
    }

    public messageEdition(data: EditMessageRequest) {
        try {
            if (!this.stompClient.connected) {
                console.warn('Cannot edit message: WebSocket not connected')
                return
            }
            const payload = data
            this.stompClient.publish({
                destination: SOCKET_EVENTS.MESSAGE.EDIT_MESSAGE,
                body: JSON.stringify(payload)
            })
        } catch (error) {
            console.error('Error editing message: ', error.message)
        }
    }

    public messageDeletion(data: number) {
        try {
            if (!this.stompClient.connected) {
                console.warn('Cannot edit message: WebSocket not connected')
                return
            }
            const payload = data
            this.stompClient.publish({
                destination: SOCKET_EVENTS.MESSAGE.DELETE_MESSAGE,
                body: JSON.stringify(payload)
            })
        } catch (error) {
            console.error('Error editing message: ', error.message)
        }
    }

    public getOnlineUsers() {
        try {
            return this.onlineUsers
        } catch (error) {
            console.error('Error getting online users:', error.message)
            return new Set()
        }
    }

    public onOnlineUsersChange(callback: (users: Set<number>) => void) {
        try {
            this.onlineUserListeners.push(callback)
        } catch (error) {
            console.error('Error adding online users listener:', error.message)
        }
    }

    public removeOnlineUsersListener(callback: (users: Set<number>) => void) {
        try {
            this.onlineUserListeners = this.onlineUserListeners.filter(cb => cb !== callback)
        } catch (error) {
            console.error('Error removing online users listener:', error.message)
        }
    }

    public onMessage(callback: (message: Message) => void) {
        try {
            this.messageListeners.push(callback)
        } catch (error) {
            console.error('Error adding message listener:', error.message)
        }
    }

    public removeMessageListener(callback: (message: Message) => void) {
        try {
            this.messageListeners = this.messageListeners.filter(cb => cb !== callback)
        } catch (error) {
            console.error('Error removing message listener:', error.message)
        }
    }

    public onReaction(callback: (message: Message) => void) {
        try {
            this.reactionListeners.push(callback)
        } catch (error) {
            console.error('Error adding reaction listener:', error.message)
        }
    }

    public removeReactionListener(callback: (message: Message) => void) {
        try {
            this.reactionListeners = this.reactionListeners.filter(cb => cb !== callback)
        } catch (error) {
            console.error('Error removing reaction listener:', error.message)
        }
    }

    public onMessageDeletion(callBack: (id: number) => void) {
        try {
            this.messageDeletionListeners.push(callBack)
        } catch (error) {
            console.error('Error adding message deletion: ', error.message)
        }
    }

    public removeMessageDeletionListener(callBack: (id: number) => void) {
        try {
            this.messageDeletionListeners = this.messageDeletionListeners.filter(cb => cb !== callBack)
        } catch (error) {
            console.error('Error removing message deletion listener:', error.message)
        }
    }


    public onMessageEdition(callBack: (message: Message) => void) {
        try {
            this.messageEditionListeners.push(callBack)
        } catch (error) {
            console.error('Error adding message edition: ', error.message)
        }
    }

    public removeMessageEditionListener(callBack: (message: Message) => void) {
        try {
            this.messageEditionListeners = this.messageEditionListeners.filter(cb => cb !== callBack)
        } catch (error) {
            console.error('Error removing message edition listener:', error.message)
        }
    }


    public sendGroupMessage(data: SendGroupMessageRequest) {
        try {
            if (!this.stompClient.connected) {
                console.warn('Cannot send group message: WebSocket not connected')
                return
            }
            const payload = data
            this.stompClient.publish({
                destination: SOCKET_EVENTS.GROUP_MESSAGE.SEND_MESSAGE,
                body: JSON.stringify(payload),
            })
        } catch (error) {
            console.error('Error sending group message:', error.message)
            if (error.message?.includes('Unauthorized') || error.message?.includes('401')) {
                this.handleUnauthorized()
            }
        }
    }

    public sendGroupMessageReply(data: SendGroupMessageRequest) {
        try {
            if (!this.stompClient.connected) {
                console.warn('Cannot send group message: WebSocket not connected')
                return
            }
            const payload = data
            this.stompClient.publish({
                destination: SOCKET_EVENTS.GROUP_MESSAGE.REPLY_MESSAGE,
                body: JSON.stringify(payload),
            })
        } catch (error) {
            console.error('Error sending group message:', error.message)
            if (error.message?.includes('Unauthorized') || error.message?.includes('401')) {
                this.handleUnauthorized()
            }
        }
    }

    public sendGroupMessageReaction(data: ChatReaction) {
        try {
            if (!this.stompClient.connected) {
                console.warn('Cannot send group message reaction: WebSocket not connected')
                return
            }
            const payload = data
            this.stompClient.publish({
                destination: SOCKET_EVENTS.GROUP_MESSAGE.REACT_MESSAGE,
                body: JSON.stringify(payload),
            })
        } catch (error) {
            console.error('Error sending group message reaction:', error.message)
            if (error.message?.includes('Unauthorized') || error.message?.includes('401')) {
                this.handleUnauthorized()
            }
        }
    }

    public editGroupMessage(data: EditMessageRequest) {
        try {
            if (!this.stompClient.connected) {
                console.warn('Cannot edit group message: WebSocket not connected')
                return
            }
            const payload = data
            this.stompClient.publish({
                destination: SOCKET_EVENTS.GROUP_MESSAGE.EDIT_MESSAGE,
                body: JSON.stringify(payload)
            })
        } catch (error) {
            console.error('Error editing group message: ', error.message)
        }
    }

    public deleteGroupMessage(messageId: number) {
        try {
            if (!this.stompClient.connected) {
                console.warn('Cannot delete group message: WebSocket not connected')
                return
            }
            const payload = messageId
            this.stompClient.publish({
                destination: SOCKET_EVENTS.GROUP_MESSAGE.DELETE_MESSAGE,
                body: JSON.stringify(payload)
            })
        } catch (error) {
            console.error('Error deleting group message: ', error.message)
        }
    }

    public onGroupMessage(callback: (message: GroupMessage) => void) {
        try {
            this.groupMessageListeners.push(callback)
        } catch (error) {
            console.error('Error adding group message listener:', error.message)
        }
    }

    public removeGroupMessageListener(callback: (message: GroupMessage) => void) {
        try {
            this.groupMessageListeners = this.groupMessageListeners.filter(cb => cb !== callback)
        } catch (error) {
            console.error('Error removing group message listener:', error.message)
        }
    }

    public onSystemMetrics(callback: (metrics: Record<string, unknown>) => void) {
        try {
            this.systemMetricsListeners.push(callback)
        } catch (error) {
            console.error('Error adding system metrics listener:', error.message)
        }
    }

    public removeSystemMetricsListener(callback: (metrics: Record<string, unknown>) => void) {
        try {
            this.systemMetricsListeners = this.systemMetricsListeners.filter(cb => cb !== callback)
        } catch (error) {
            console.error('Error removing system metrics listener:', error.message)
        }
    }
}

export const socketService = new SocketService()