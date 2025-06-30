/**
 * Represents a user in the system.
 * @property {string} avatar - The user's avatar URL.
 * @property {string} createdAt - The date the user was created.
 * @property {string} email - The user's email address (optional).
 * @property {number} id - The user's unique identifier.
 * @property {boolean} isAdmin - Whether the user is an admin.
 * @property {boolean} isOnline - Whether the user is currently online (optional).
 * @property {string} lastActive - The last time the user was active.
 * @property {string} name - The user's display name.
 * @property {string} role - The user's role (optional).
 * @property {"active"|"blocked"|"suspended"} status - The user's status.
 */
export interface User {
  avatar: string;
  createdAt: string;
  email?: string;
  id: number;
  isAdmin: boolean;
  isOnline?: boolean;
  lastActive: string;
  name: string;
  role?: "user" | "admin";
  status: "active" | "blocked" | "suspended";
}

/**
 * User settings/preferences.
 */
export interface UserSettings {
  autoStatus?: boolean;
  emailNotifications?: boolean;
  id: number;
  language?: string;
  notificationEnabled?: boolean;
  profileVisibility?: "public" | "friends" | "private";
  pushNotifications?: boolean;
  readReceipts?: boolean;
  showOnlineStatus?: boolean;
  soundEnabled?: boolean;
  theme?: "BLUE" | "DARK" | "CYBERPUNK" | "NEON" | "OCEAN" | "SUNSET";
  timezone?: string;
  user: User;
}

/**
 * Request to update user profile.
 */
export interface UpdateProfileRequest {
  avatar?: string;
  email?: string;
  name?: string;
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

export interface UpdateUserRequest {
  avatar?: string;
  email?: string;
  isAdmin?: boolean;
  name?: string;
  status?: 'active' | 'blocked' | 'suspended';
}

export interface PrivacySettings {
  allowMessageRequests: boolean;
  blockedUsers: string[];
  profileVisibility: 'public' | 'friends' | 'private';
  readReceipts: boolean;
  showOnlineStatus: boolean;
} 