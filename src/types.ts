
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
