export interface User {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  isOnline: boolean;
}

export interface Message {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  isEdited?: boolean;
  chatWithUserId?: string;
  senderId?: string; // Added for compatibility with GroupChat
  type: "text" | "image" | "audio" | "file"; // Added message types
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
  description?: string; // Made optional to match usage
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
