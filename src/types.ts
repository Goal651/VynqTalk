
export interface User {
  id: number // Changed back to string for consistency
  name: string
  email?: string
  avatar: string
  isAdmin: boolean
  role?: 'user' | 'admin' | 'moderator'
}

export interface Message {
  id: number
  senderId: number // Changed to string and keeping senderId
  receiverId?: number // Made optional and string
  content: string
  timestamp: string
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
  id: number
  emoji: string
  userId: number
  userName: string
}

export interface Group {
  id: number
  name: string
  description?: string
  avatar: string
  members: User[]
  createdBy: User
  createdAt: Date
  isPrivate?: boolean
}

export interface Notification {
  id: string
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  type: "info" | "warning" | "error" | "success"
}
