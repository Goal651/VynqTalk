/**
 * Represents a group chat.
 */
import type { User } from "./user";
import type { UserProfile } from './user';

export interface Group {
  id: number;
  name: string;
  description: string;
  avatar: string;
  members: User[];
  admins: User[];
  status: "active" | "suspended";
  createdBy: User;
  createdAt: string;
  isPrivate?: boolean;
}

