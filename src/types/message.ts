// Import dependencies
import type { User } from "./user";
import type { Group } from "./group";


/**
 * Represents a direct message between users.
 */
export interface Message {
  id: number;
  sender: User;
  receiver: User;
  content: string;
  timestamp: string;
  edited?: boolean;
  type: "TEXT" | "IMAGE" | "AUDIO" | "FILE";
  reactions?: Reaction[];
  replyTo?: Message;
}

/**
 * Represents a message in a group chat.
 */
export interface GroupMessage {
  /** Unique identifier for the message */
  id: number;
  /** ID of the group this message belongs to */
  group: Group;
  /** ID of the sender */
  sender: User;
  /** Content of the message */
  content: string;
  /** Whether the message has been edited */
  isEdited: boolean;
  /** Array of reactions to the message */
  reactions: Reaction[];
  /** The message this is replying to, if any */
  replyTo?: GroupMessage;
  /** Type of the message */
  type: "TEXT" | "IMAGE" | "AUDIO" | "FILE";
  /** Timestamp of the message */
  timestamp: string;
}

/**
 * Represents a reaction to a message.
 */
export interface Reaction {
  userId: number;
  emoji: string;
}


/**
 * Request payload for sending a direct message.
 */
export interface SendMessageRequest {
  content: string;
  receiverId: number;
  senderId: number;
  type?: "TEXT" | "IMAGE" | "AUDIO" | "FILE";
  replyToId?: number;
}

/**
 * Request payload for sending a group message.
 */
export interface SendGroupMessageRequest {
  content: string;
  groupId: number;
  type?: "TEXT" | "IMAGE" | "AUDIO" | "FILE";
  replyToId?: number;
} 