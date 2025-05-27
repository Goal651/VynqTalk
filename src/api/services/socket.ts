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
    }

    private handleMessage(message: IMessage) {
        const body = JSON.parse(message.body);
        console.log('Received message:', body);
        // Dispatch to store or set state here
    }

    public sendMessage(content: string, receiver: string, sender: string) {
        const payload = { content, receiver, type: 'CHAT', sender };
        this.stompClient.publish({
            destination: '/app/chat.sendMessage',
            body: JSON.stringify(payload),
        });
    }
}

export const socketService = new SocketService();
