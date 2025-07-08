// Import dependencies
import type { User } from "./user"
import type { Group } from "./group"

export type MessageType = "TEXT" | "IMAGE" | "AUDIO" | "FILE" | "VIDEO"

/**
 * Represents a direct message between users.
 */
export interface Message {
  id: number
  sender: User
  receiver: User
  content: string
  timestamp: string
  edited?: boolean
  type: MessageType
  reactions?: Reaction[]
  replyTo?: Message
  fileName?: string
}

/**
 * Represents a message in a group chat.
 */
export interface GroupMessage {
  id: number
  group: Group
  sender: User
  content: string
  isEdited: boolean
  reactions: Reaction[]
  replyTo?: GroupMessage
  type: MessageType
  timestamp: string
  fileName?: string
}

/**
 * Represents a reaction to a message.
 */
export interface Reaction {
  userId: number
  emoji: string
}

export interface ChatReaction {
  messageId: number,
  reactions: Reaction[]
}


/**
 * Request payload for sending a direct message.
 */
export interface SendMessageRequest {
  content: string
  receiverId: number
  senderId: number
  type: MessageType
  fileName?: string
  replyToId?: number
}

/**
* Request payload for sending a group message.
*/
export interface SendGroupMessageRequest {
  content: string
  groupId: number
  senderId: number
  type: MessageType
  fileName?: string
  replyToId?: number
}
