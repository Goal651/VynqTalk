// All interfaces and types have been moved to individual files in src/types/ for better organization.
// Please import from './types' or the specific file in './types/'.

/**
 * Represents a user in the system.
 */
export interface User {
  id: number;
  name: string;
  status: "active" | "blocked" | "suspended";
  createdAt: string;
  lastActive: string;
  email?: string;
  avatar: string;
  isOnline?: boolean;
  isAdmin: boolean;
  role?: "user" | "admin" | "moderator";
}

/**
 * User settings/preferences.
 */
export interface UserSettings {
  id: number;
  user: User;
  autoStatus?: boolean;
  emailNotifications?: boolean;
  language?: string;
  notificationEnabled?: boolean;
  profileVisibility?: "public" | "friends" | "private";
  pushNotifications?: boolean;
  readReceipts?: boolean;
  showOnlineStatus?: boolean;
  soundEnabled?: boolean;
  theme?: "blue" | "dark" | "cyberpunk" | "neon" | "ocean" | "sunset";
  timezone?: string;
}

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
  sender: User;
  group: Group;
  content: string;
  timestamp: string;
  edited?: boolean;
  type: "text" | "image" | "audio" | "file";
  reactions?: string[];
  replyToMessage?: GroupMessage;
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

/**
 * Represents a group chat.
 */
export interface Group {
  id: number;
  name: string;
  description?: string;
  avatar: string;
  members: User[];
  admins: User[];
  status: "active" | "suspended";
  createdBy: User;
  createdAt: string;
  isPrivate?: boolean;
}

/**
 * Represents a notification sent to a user.
 */
export interface Notification {
  id: number;
  title: string;
  user: User;
  message: string;
  timestamp: Date;
  isRead: boolean;
  type: "info" | "warning" | "error" | "success";
}
