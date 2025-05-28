
import { Message, User } from "../types";

export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Alex Johnson",
    avatar: "https://ui-avatars.com/api/?name=Alex+Johnson&background=random",
    isOnline: true,
    isAdmin: false
  },
  {
    id: "u2",
    name: "Jamie Smith",
    avatar: "https://ui-avatars.com/api/?name=Jamie+Smith&background=random",
    isOnline: true,
    isAdmin: false
  },
  {
    id: "u3",
    name: "Taylor Brown",
    avatar: "https://ui-avatars.com/api/?name=Taylor+Brown&background=random",
    isOnline: false,
    isAdmin: false
  },
  {
    id: "u4",
    name: "Casey Wilson",
    avatar: "https://ui-avatars.com/api/?name=Casey+Wilson&background=random",
    isOnline: true,
    isAdmin: false
  },
];

export const mockMessages: Message[] = [
  {
    id: "m1",
    senderId: "u1",
    content: "Hey everyone! Welcome to PulseChat.",
    timestamp: new Date(Date.now() - 600000).toISOString(),
    type: "text"
  },
  {
    id: "m2",
    senderId: "u2",
    content: "Thanks! The interface looks really nice!",
    timestamp: new Date(Date.now() - 500000).toISOString(),
    type: "text"
  },
  {
    id: "m3",
    senderId: "u1",
    content: "Absolutely! I love the dark theme and subtle animations.",
    timestamp: new Date(Date.now() - 400000).toISOString(),
    type: "text"
  },
  {
    id: "m4",
    senderId: "u4",
    content: "Just joined. This is a cool chat app!",
    timestamp: new Date(Date.now() - 300000).toISOString(),
    type: "text"
  },
  {
    id: "m5",
    senderId: "u2",
    content: "I agree! The messages load so smoothly.",
    timestamp: new Date(Date.now() - 200000).toISOString(),
    type: "text"
  },
  {
    id: "m6",
    senderId: "u1",
    content: "Let's try out some of the features. I think we can add emojis too! 😊",
    timestamp: new Date(Date.now() - 100000).toISOString(),
    type: "text"
  }
];

// Current user is set to Alex Johnson for this demo
export const currentUser: User = mockUsers[0];
