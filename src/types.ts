
export interface User {
  id: string; // Changed back to string for consistency
  name: string;
  email?: string;
  avatar: string;
  isOnline?: boolean;
  isAdmin: boolean;
  role?: 'user' | 'admin' | 'moderator';
}

export interface Message {
  id: string;
  senderId: string; // Changed to string and keeping senderId
  receiverId?: string; // Made optional and string
  content: string;
  timestamp: Date;
  edited?: boolean;
  type: "text" | "image" | "audio" | "file";
  reactions?: Reaction[];
  replyTo?: {
    messageId: string;
    userId: string;
    userName: string;
    content: string;
  };
}

export interface Reaction {
  id: string;
  emoji: string;
  userId: string;
  userName: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  avatar: string;
  members: string[];
  createdBy: string;
  createdAt: Date;
  isPrivate?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  type: "info" | "warning" | "error" | "success";
}
