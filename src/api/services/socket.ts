import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { Message, User, GroupMessage, Group } from '@/types';
import { API_CONFIG } from '../constants';

class SocketService {
    private stompClient: Client;
    private onlineUsers: Map<string, string> = new Map();
    private onlineUserListeners: ((users: Map<string, string>) => void)[] = [];
    private messageListeners: ((message: Message) => void)[] = [];
    private groupMessageListeners: ((message: GroupMessage) => void)[] = [];
    private reactionListeners: ((message: Message) => void)[] = [];
    private logoutListeners: (() => void)[] = [];
    private connectionAttempts: number = 0;
    private maxConnectionAttempts: number = 3;

    constructor() {
        this.stompClient = new Client({
            webSocketFactory: () => {
                try {
                    const token = localStorage.getItem("access_token");
                    if (!token) {
                        console.warn('No token in localStorage, triggering logout');
                        this.logout();
                        throw new Error('Missing access token');
                    }
                    return new SockJS(`${API_CONFIG.BASE_URL}/ws?token=${encodeURIComponent(token)}`, null, {
                        transports: ['websocket', 'xhr-polling', 'eventsource'],
                        timeout: 10000
                    });
                } catch (error) {
                    console.error('Failed to initialize WebSocket factory:', error.message);
                    this.logout();
                    throw error; // Prevent client activation
                }
            },
            reconnectDelay: 5000,
            onConnect: () => {
                try {
                    console.log('WebSocket connected');
                    this.connectionAttempts = 0; // Reset attempts
                    this.subscribeToPublic();
                } catch (error) {
                    console.error('Error in onConnect handler:', error.message);
                }
            },
            onStompError: (frame) => {
                try {
                    console.error('STOMP error:', frame.headers['message'], frame.body);
                    if (
                        frame.headers['message']?.includes('Unauthorized') ||
                        frame.body?.includes('401') ||
                        frame.headers['message']?.includes('token')
                    ) {
                        console.warn('Unauthorized error detected, attempting token refresh');
                        this.handleUnauthorized();
                    } else {
                        this.handleConnectionError(new Error(`STOMP error: ${frame.headers['message']}`));
                    }
                } catch (error) {
                    console.error('Error handling STOMP error:', error.message);
                }
            },
            onWebSocketError: (error) => {
                try {
                    console.error('WebSocket connection error:', error.message);
                    if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
                        console.warn('WebSocket 401 error, attempting token refresh');
                        this.handleUnauthorized();
                    } else {
                        this.handleConnectionError(error);
                    }
                } catch (err) {
                    console.error('Error handling WebSocket error:', err.message);
                }
            }
        });
    }

    private async handleUnauthorized() {
        try {
            if (this.connectionAttempts >= this.maxConnectionAttempts) {
                console.warn('Max connection attempts reached, logging out');
                this.logout();
                return;
            }
            this.connectionAttempts++;
            const refreshToken = localStorage.getItem("refresh_token");
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("access_token", data.accessToken);
                console.log('Token refreshed, reconnecting');
                await this.stompClient.deactivate();
                this.stompClient.activate();
                this.connectionAttempts = 0;
            } else {
                console.warn('Token refresh failed with status:', response.status);
                throw new Error('Refresh token invalid or expired');
            }
        } catch (error) {
            console.error('Failed to refresh token:', error.message);
            this.logout();
        }
    }

    private handleConnectionError(error: Error) {
        try {
            console.error('Handling connection error:', error.message);
            if (this.connectionAttempts < this.maxConnectionAttempts) {
                console.warn(`Connection attempt ${this.connectionAttempts + 1}/${this.maxConnectionAttempts}`);
                this.connectionAttempts++;
                setTimeout(() => {
                    console.log('Retrying WebSocket connection');
                    this.stompClient.activate();
                }, 2000 * this.connectionAttempts);
            } else {
                console.warn('Max connection attempts reached, logging out');
                this.logout();
            }
        } catch (err) {
            console.error('Error in connection error handler:', err.message);
            this.logout();
        }
    }

    public async logout() {
        try {
            console.log('Logging out user');
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            await this.stompClient.deactivate();
            this.onlineUsers = new Map();
            this.onlineUserListeners.forEach((callback) => {
                try {
                    callback(new Map());
                } catch (error) {
                    console.error('Error in online users callback:', error.message);
                }
            });
            this.logoutListeners.forEach((callback) => {
                try {
                    callback();
                } catch (error) {
                    console.error('Error in logout callback:', error.message);
                }
            });
        } catch (error) {
            console.error('Error during logout:', error.message);
        } finally {
            this.logoutListeners.forEach((callback) => {
                try {
                    callback();
                } catch (error) {
                    console.error('Error in final logout callback:', error.message);
                }
            });
        }
    }

    public onLogout(callback: () => void) {
        try {
            this.logoutListeners.push(callback);
        } catch (error) {
            console.error('Error adding logout listener:', error.message);
        }
    }

    public removeLogoutListener(callback: () => void) {
        try {
            this.logoutListeners = this.logoutListeners.filter(cb => cb !== callback);
        } catch (error) {
            console.error('Error removing logout listener:', error.message);
        }
    }

    public connect() {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                console.warn('No access token found, logging out');
                this.logout();
                return;
            }
            this.stompClient.activate();
        } catch (error) {
            console.error('Error connecting to WebSocket:', error.message);
            this.handleConnectionError(error);
        }
    }

    public async disconnect() {
        try {
            await this.stompClient.deactivate();
            this.onlineUsers = new Map();
            this.onlineUserListeners.forEach((callback) => {
                try {
                    callback(new Map());
                } catch (error) {
                    console.error('Error in online users callback:', error.message);
                }
            });
        } catch (error) {
            console.error('Error disconnecting WebSocket:', error.message);
        }
    }

    private subscribeToPublic() {
        try {
            this.stompClient.subscribe('/topic/onlineUsers', (message) => this.handleOnlineUsers(message));
            this.stompClient.subscribe('/topic/messages', (message) => this.handleMessage(message));
            this.stompClient.subscribe('/topic/reactions', (message) => this.handleReaction(message));
            this.stompClient.subscribe('/topic/groupMessages', (message) => this.handleGroupMessage(message));
        } catch (error) {
            console.error('Error subscribing to public topics:', error.message);
        }
    }

    private handleReaction(message: IMessage) {
        try {
            const body = JSON.parse(message.body) as Message;
            console.log('Received reaction:', body);
            this.reactionListeners.forEach((callback) => {
                try {
                    callback(body);
                } catch (error) {
                    console.error('Error in reaction callback:', error.message);
                }
            });
        } catch (error) {
            console.error('Failed to parse reaction:', error.message);
        }
    }

    private handleMessage(message: IMessage) {
        try {
            const body = JSON.parse(message.body) as Message;
            console.log('Received message:', body);
            this.messageListeners.forEach((callback) => {
                try {
                    callback(body);
                } catch (error) {
                    console.error('Error in message callback:', error.message);
                }
            });
        } catch (error) {
            console.error('Failed to parse message:', error.message);
        }
    }

    private handleOnlineUsers(message: IMessage) {
        try {
            const res = JSON.parse(message.body) 
            const users = new Map<string, string>(Object.entries(res));
            console.log('Received online users:', users);
            this.onlineUsers = users;
            this.onlineUserListeners.forEach((callback) => {
                try {
                    callback(users);
                } catch (error) {
                    console.error('Error in online users callback:', error.message);
                }
            });
        } catch (error) {
            console.error('Failed to parse online users:', error.message);
        }
    }

    private handleGroupMessage(message: IMessage) {
        try {
            const body = JSON.parse(message.body) as GroupMessage;
            console.log('Received group message:', body);
            this.groupMessageListeners.forEach((callback) => {
                try {
                    callback(body);
                } catch (error) {
                    console.error('Error in group message callback:', error.message);
                }
            });
        } catch (error) {
            console.error('Failed to parse group message:', error.message);
        }
    }

    public sendMessage(content: string, receiver: User, type: 'text' | 'image' | 'audio' | 'file', sender: User) {
        try {
            if (!this.stompClient.connected) {
                console.warn('Cannot send message: WebSocket not connected');
                return;
            }
            const payload = { content, receiver, type, sender }; // Match backend
            this.stompClient.publish({
                destination: '/app/chat.sendMessage',
                body: JSON.stringify(payload),
            });
        } catch (error) {
            console.error('Error sending message:', error.message);
            if (error.message?.includes('Unauthorized') || error.message?.includes('401')) {
                this.handleUnauthorized();
            }
        }
    }

    public messageReply(content: string, receiver: User, type: 'text' | 'image' | 'audio' | 'file', sender: User, replyToMessage: Message) {
        try {
            if (!this.stompClient.connected) {
                console.warn('Cannot send message: WebSocket not connected');
                return;
            }
            const payload = { content, receiver, type, sender, replyToMessage }; // Match backend
            this.stompClient.publish({
                destination: '/app/chat.sendMessageReply',
                body: JSON.stringify(payload),
            });
        } catch (error) {
            console.error('Error sending message:', error.message);
            if (error.message?.includes('Unauthorized') || error.message?.includes('401')) {
                this.handleUnauthorized();
            }
        }
    }

    public messageReact(messageId: number, reactions: string[]) {
        try {
            if (!this.stompClient.connected) {
                console.warn('Cannot send message: WebSocket not connected');
                return;
            }
            const payload = { messageId, reactions }; // Match backend
            this.stompClient.publish({
                destination: '/app/chat.sendMessageReaction',
                body: JSON.stringify(payload),
            });
        } catch (error) {
            console.error('Error sending message:', error.message);
            if (error.message?.includes('Unauthorized') || error.message?.includes('401')) {
                this.handleUnauthorized();
            }
        }
    }

    public getOnlineUsers() {
        try {
            return this.onlineUsers;
        } catch (error) {
            console.error('Error getting online users:', error.message);
            return [];
        }
    }

    public onOnlineUsersChange(callback: (users: Map<string, string>) => void) {
        try {
            this.onlineUserListeners.push(callback);
        } catch (error) {
            console.error('Error adding online users listener:', error.message);
        }
    }

    public removeOnlineUsersListener(callback: (users: Map<string, string>) => void) {
        try {
            this.onlineUserListeners = this.onlineUserListeners.filter(cb => cb !== callback);
        } catch (error) {
            console.error('Error removing online users listener:', error.message);
        }
    }

    public onMessage(callback: (message: Message) => void) {
        try {
            this.messageListeners.push(callback);
        } catch (error) {
            console.error('Error adding message listener:', error.message);
        }
    }

    public removeMessageListener(callback: (message: Message) => void) {
        try {
            this.messageListeners = this.messageListeners.filter(cb => cb !== callback);
        } catch (error) {
            console.error('Error removing message listener:', error.message);
        }
    }

    public onReaction(callback: (message: Message) => void) {
        try {
            this.reactionListeners.push(callback);
        } catch (error) {
            console.error('Error adding reaction listener:', error.message);
        }
    }

    public removeReactionListener(callback: (message: Message) => void) {
        try {
            this.reactionListeners = this.reactionListeners.filter(cb => cb !== callback);
        } catch (error) {
            console.error('Error removing reaction listener:', error.message);
        }
    }

    public sendGroupMessage(content: string, group: Group, type: 'text' | 'image' | 'audio' | 'file', sender: User) {
        try {
            if (!this.stompClient.connected) {
                console.warn('Cannot send group message: WebSocket not connected');
                return;
            }
            const payload = { content, group, type, sender };
            this.stompClient.publish({
                destination: '/app/group.sendMessage',
                body: JSON.stringify(payload),
            });
        } catch (error) {
            console.error('Error sending group message:', error.message);
            if (error.message?.includes('Unauthorized') || error.message?.includes('401')) {
                this.handleUnauthorized();
            }
        }
    }

    public onGroupMessage(callback: (message: GroupMessage) => void) {
        try {
            this.groupMessageListeners.push(callback);
        } catch (error) {
            console.error('Error adding group message listener:', error.message);
        }
    }

    public removeGroupMessageListener(callback: (message: GroupMessage) => void) {
        try {
            this.groupMessageListeners = this.groupMessageListeners.filter(cb => cb !== callback);
        } catch (error) {
            console.error('Error removing group message listener:', error.message);
        }
    }
}

export const socketService = new SocketService();