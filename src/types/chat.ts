/**
 * Chat and message types.
 */
import type { UserProfile } from './user';

export interface SendMessageRequest {
  content: string;
  type: 'text' | 'image' | 'audio' | 'file';
  chatWithUserId?: number;
  groupId?: number;
  replyToId?: number;
}

export interface MessageResponse {
  id: number;
  content: string;
  type: 'text' | 'image' | 'audio' | 'file';
  senderId: number;
  senderName: string;
  senderAvatar?: string;
  timestamp: string;
  isEdited: boolean;
  reactions: Array<{
    id: string;
    emoji: string;
    userId: string;
    userName: string;
  }>;
  replyTo?: {
    messageId: number;
    userId: number;
    userName: string;
    content: string;
  };
}

export interface ConversationResponse {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  avatar?: string;
  participants: UserProfile[];
  lastMessage?: MessageResponse;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  from: string;
  to: string;
  content: string;
  timestamp?: string;
} 