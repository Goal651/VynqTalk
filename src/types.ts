export interface User {
  id: number // Changed back to string for consistency
  name: string
  status: "active" | "blocked" | "suspended"
  createdAt: string
  lastActive: string
  email?: string
  avatar: string
  isOnline?: boolean
  isAdmin: boolean
  role?: 'user' | 'admin' | 'moderator'
}

export interface UserSettings {
  id: number;
  user: User;
  theme?: "BLUE" | "DARK" | "CYBERPUNK" | "NEON" | "OCEAN" | "SUNSET"
  language?: string;
  timezone?: string;
  notificationEnabled?: boolean;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  soundEnabled?: boolean;
  autoStatus?: boolean;
  showOnlineStatus?: boolean;
  readReceipts?: boolean;
  profileVisibility?: 'public' | 'friends' | 'private';
}

export interface Message {
  id: number
  sender: User // Changed to string and keeping senderId
  receiver?: User // Made optional and string
  content: string
  timestamp: string
  edited?: boolean
  type: "text" | "image" | "audio" | "file"
  reactions?: string[]
  replyToMessage?: Message
}

export interface GroupMessage {
  id: number
  sender: User
  group: Group
  content: string
  timestamp: string
  edited?: boolean
  type: "text" | "image" | "audio" | "file"
  reactions?: string[]
  replyToMessage?: GroupMessage
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
  status: "active" | "suspended"
  createdBy: User
  createdAt: string
  isPrivate?: boolean
}

export interface Notification {
  id: number
  title: string
  user: User
  message: string
  timestamp: Date
  isRead: boolean
  type: "info" | "warning" | "error" | "success"
}
