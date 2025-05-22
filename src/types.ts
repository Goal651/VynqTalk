
export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

export interface Message {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
}

export interface Group {
  id: string;
  name: string;
  avatar: string;
  members: string[]; // Array of user IDs
  createdBy: string; // User ID of creator
  createdAt: Date;
}
