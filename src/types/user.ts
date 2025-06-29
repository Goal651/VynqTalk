/**
 * Represents a user in the system.
 */
export interface User {
  id: number;
  name: string;
  status: "active" | "blocked" | "suspended";
  createdAt: string;
  lastActive: string;
  email?: string;
  avatar: string;
  isOnline?: boolean;
  isAdmin: boolean;
  role?: "user" | "admin" | "moderator";
}

/**
 * User settings/preferences.
 */
export interface UserSettings {
  id: number;
  user: User;
  autoStatus?: boolean;
  emailNotifications?: boolean;
  language?: string;
  notificationEnabled?: boolean;
  profileVisibility?: "public" | "friends" | "private";
  pushNotifications?: boolean;
  readReceipts?: boolean;
  showOnlineStatus?: boolean;
  soundEnabled?: boolean;
  theme?: "blue" | "dark" | "cyberpunk" | "neon" | "ocean" | "sunset";
  timezone?: string;
}

/**
 * Request to update user profile.
 */
export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  avatar?: string;
}

/**
 * User profile details.
 */
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  avatar?: string;
  isAdmin?: boolean;
  status?: 'active' | 'blocked' | 'suspended';
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showOnlineStatus: boolean;
  allowMessageRequests: boolean;
  readReceipts: boolean;
  blockedUsers: string[];
} 