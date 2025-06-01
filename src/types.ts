
export interface User {
  id: string // Changed to string for consistency
  name: string
  email?: string
  avatar: string
  isOnline?: boolean
  isAdmin: boolean
  role?: 'user' | 'admin' | 'moderator'
}

export interface Message {
  id: string // Changed to string
  senderId: string // Changed to string
  receiverId?: string // Made optional and string
  content: string
  timestamp: Date // Changed to Date for proper date handling
  edited?: boolean
  type: "text" | "image" | "audio" | "file"
  reactions?: string[]
  replyToMessageId?: Message
}

export interface Reaction {
  id: string // Changed to string
  emoji: string
  userId: string // Changed to string
  userName: string
}

export interface Group {
  id: string // Changed to string
  name: string
  description?: string
  avatar: string
  members: string[]
  createdBy: string
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
