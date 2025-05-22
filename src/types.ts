
export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  status?: string;
  lastSeen?: Date;
  email?: string;
}

export interface Message {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  isEdited?: boolean;
  attachments?: string[];
  reactions?: Reaction[];
}

export interface Reaction {
  userId: string;
  emoji: string;
}

export interface Group {
  id: string;
  name: string;
  avatar: string;
  members: string[]; // Array of user IDs
  createdBy: string; // User ID of creator
  createdAt: Date;
  description?: string;
}

export interface AuthUser {
  email: string;
  password: string;
}
