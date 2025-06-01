
export interface User {
  id: number // Changed back to number
  name: string
  email?: string
  avatar: string
  isAdmin: boolean
  role?: 'user' | 'admin' | 'moderator'
}

export interface Message {
  id: number // Changed back to number
  senderId: number // Changed back to number
  receiverId?: number // Changed back to number
  content: string
  timestamp: Date
  edited?: boolean
  type: "text" | "image" | "audio" | "file"
  reactions?: string[]
  replyToMessageId?: Message
}

export interface GroupMessage {
  id: number
  groupId: number
  edited?: boolean
  replyToMessageId?: Message
  senderId: number
  content: string
  timestamp: string
  type: "text" | "image" | "audio" | "file"
  reactions?: string[]
}

export interface Reaction {
  id: number // Changed back to number
  emoji: string
  userId: number // Changed back to number
  userName: string
}

export interface Group {
  id: number // Changed back to number
  name: string
  description?: string
  avatar: string
  members: User[]
  createdBy: User

  createdAt: Date
  isPrivate?: boolean
}

export interface Notification {
  id: number
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  type: "info" | "warning" | "error" | "success"
}
