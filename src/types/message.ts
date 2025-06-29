/**
 * Represents a direct message between users.
 */
export interface Message {
  id: number;
  sender: User;
  receiver?: User;
  content: string;
  timestamp: string;
  edited?: boolean;
  type: "text" | "image" | "audio" | "file";
  reactions?: string[];
  replyToMessage?: Message;
}

/**
 * Represents a message in a group chat.
 */
export interface GroupMessage {
  id: number;
  groupId: number;
  senderId: number;
  content: string;
  type: 'text' | 'image' | 'audio' | 'file';
  timestamp: string;
  isEdited: boolean;
  reactions: Array<{
    id: number;
    emoji: string;
    userId: number;
    userName: string;
  }>;
  replyTo?: {
    messageId: number;
    userId: number;
    userName: string;
    content: string;
  };
}

/**
 * Represents a reaction to a message.
 */
export interface Reaction {
  id: number;
  emoji: string;
  userId: number;
  userName: string;
}

// Import dependencies
import type { User } from "./user";
import type { Group } from "./group";

export interface SendMessageRequest {
  content: string;
  receiverId: number;
  senderId: number;
  type?: "text" | "image" | "audio" | "file";
  replyToId?: number;
}

export interface SendGroupMessageRequest {
  content: string;
  groupId: number;
  type?: "text" | "image" | "audio" | "file";
  replyToId?: number;
} 