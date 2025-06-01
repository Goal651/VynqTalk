
import { User, Message, Group, Notification } from "../types";

export const mockUsers: User[] = [
  {
    id: 1, // Changed back to number
    name: "Alice Johnson",
    email: "alice@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    isOnline: true,
    isAdmin: false,
    role: "user"
  },
  {
    id: 2, // Changed back to number
    name: "Bob Smith",
    email: "bob@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    isOnline: false,
    isAdmin: false,
    role: "user"
  },
  {
    id: 3, // Changed back to number
    name: "Charlie Brown",
    email: "charlie@example.com", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
    isOnline: true,
    isAdmin: true,
    role: "admin"
  },
  {
    id: 4, // Changed back to number
    name: "Diana Prince",
    email: "diana@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana",
    isOnline: true,
    isAdmin: false,
    role: "moderator"
  }
];

export const mockMessages: Message[] = [
  {
    id: 1, // Changed back to number
    senderId: 1,
    receiverId: 2,
    content: "Hey Bob! How are you doing?",
    timestamp: new Date("2024-01-15T10:30:00Z"),
    type: "text",
    reactions: ["👍", "❤️"]
  },
  {
    id: 2, // Changed back to number
    senderId: 2,
    receiverId: 1,
    content: "Hi Alice! I'm doing great, thanks for asking!",
    timestamp: new Date("2024-01-15T10:32:00Z"),
    type: "text"
  },
  {
    id: 3, // Changed back to number
    senderId: 1,
    receiverId: 3, 
    content: "Charlie, can you help me with the admin panel?",
    timestamp: new Date("2024-01-15T11:15:00Z"),
    type: "text"
  },
  {
    id: 4, // Changed back to number
    senderId: 3,
    receiverId: 1,
    content: "Of course! Let me know what you need help with.",
    timestamp: new Date("2024-01-15T11:18:00Z"),
    type: "text",
    reactions: ["👍"]
  },
  {
    id: 5, // Changed back to number
    senderId: 4, 
    receiverId: 1,
    content: "Welcome to VynqTalk! Hope you enjoy using the platform.",
    timestamp: new Date("2024-01-15T09:45:00Z"),
    type: "text",
    reactions: ["🎉", "👋"]
  },
  {
    id: 6, // Changed back to number
    senderId: 1,
    receiverId: 4,
    content: "Thank you Diana! The platform looks amazing.",
    timestamp: new Date("2024-01-15T09:47:00Z"),
    type: "text"
  }
];

export const mockGroups: Group[] = [
  {
    id: 1, // Changed back to number
    name: "General Discussion",
    description: "Main chat for everyone",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=GD",
    members: [1, 2, 3, 4],
    createdBy: 3,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    isPrivate: false
  },
  {
    id: 2, // Changed back to number
    name: "Tech Talk",
    description: "Discuss technology and development",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TT", 
    members: [1, 3, 4],
    createdBy: 3,
    createdAt: new Date("2024-01-05T00:00:00Z"),
    isPrivate: false
  },
  {
    id: 3, // Changed back to number
    name: "Admin Only",
    description: "Private admin discussions",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=AO",
    members: [3],
    createdBy: 3, 
    createdAt: new Date("2024-01-10T00:00:00Z"),
    isPrivate: true
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "New Message",
    message: "Alice sent you a message",
    timestamp: new Date("2024-01-15T10:30:00Z"),
    isRead: false,
    type: "info"
  },
  {
    id: 2, 
    title: "Group Invitation",
    message: "You've been invited to Tech Talk",
    timestamp: new Date("2024-01-15T09:15:00Z"),
    isRead: true,
    type: "success"
  },
  {
    id: 3,
    title: "System Update",
    message: "VynqTalk has been updated to v2.1",
    timestamp: new Date("2024-01-14T16:00:00Z"),
    isRead: false,
    type: "info"
  }
];
