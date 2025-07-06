import { Group } from "./group";
import { Theme } from "./system";

/**
 * Represents a user in the system.
 * @property {string} avatar - The user's avatar URL.
 * @property {string} createdAt - The date the user was created.
 * @property {string} email - The user's email address (optional).
 * @property {number} id - The user's unique identifier.
 * @property {boolean} isOnline - Whether the user is currently online (optional).
 * @property {string} lastActive - The last time the user was active.
 * @property {string} name - The user's display name.
 * @property {string} userRole - The user's role ("USER" | "ADMIN").
 * @property {"active"|"blocked"|"suspended"} status - The user's status.
 */
export interface User {
  id: number;
  email: string;
  name: string;
  bio: string
  avatar: string;
  createdAt: string;
  lastActive: string;
  userRole: "USER" | "ADMIN";
  status: "active" | "blocked" | "suspended";
}

/**
 * User settings/preferences.
 */
export interface UserSettings {
  id: number;
  user: User;
  showOnlineStatus: boolean;
  notificationEnabled?: boolean;
  theme: Theme
}


/**
 * User profile details.
 */
export interface UserProfile {
  avatar?: string;
  bio?: string;
  createdAt: string;
  email: string;
  id: number;
  isOnline: boolean;
  lastSeen?: string;
  name: string;
  updatedAt: string;
}



export interface ExportUser {
  user: User
  groups: Group[]
} 