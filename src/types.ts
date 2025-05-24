
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
  chatWithUserId?: string; // Added to track which user this message is for
}

export interface Group {
  id: string;
  name: string;
  description: string;
  avatar: string;
  members: string[]; // Changed from User[] to string[] to store user IDs
  createdBy: string; // Added to track who created the group
  createdAt: Date;
  isPrivate?: boolean; // Made optional since it's not used in Groups.tsx
}
