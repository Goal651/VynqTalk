import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';

class SocketService {
    private stompClient: Client;

    constructor() {
        this.stompClient = new Client({
            webSocketFactory: () => new SockJS('http://localhost:4000/ws'),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('WebSocket connected');
                this.subscribeToPublic();
            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame.headers['message'], frame.body);
            },
        });
    }

    public connect() {
        this.stompClient.activate();
    }

    public disconnect() {
        this.stompClient.deactivate();
    }

    private subscribeToPublic() {
        this.stompClient.subscribe('/topic/public', this.handleMessage);
        this.stompClient.subscribe('/topic/onlineUsers', this.handleOnlineUsers)
    }

    private handleMessage(message: IMessage) {
        const body = JSON.parse(message.body);
        console.log('Received message:', body);
        // Dispatch to store or set state here
    }

    private handleOnlineUsers(onlineUsers: IMessage) {
        console.log(onlineUsers)
    }

    public sendMessage(content: string, receiver: number, type: 'text' | 'image' | 'audio' | 'file', sender: number) {
        const payload = { content, receiver, type, sender };
        this.stompClient.publish({
            destination: '/app/chat.sendMessage',
            body: JSON.stringify(payload),
        });
    }
}

export const socketService = new SocketService();
