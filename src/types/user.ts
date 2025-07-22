import { Group } from "./group"
import { Message } from "./message"
import { Theme } from "./system"

/**
 * Represents a user in the system.
 */
export interface User {
  id: number
  email: string
  name: string
  bio: string
  avatar: string
  createdAt: string
  lastActive: string
  userRole: "USER" | "ADMIN"
  status: "active" | "blocked" | "suspended"
  latestMessage?: Message | null
  isOnline?: boolean
  unreadMessages?: Message[]
}

/**
 * User settings/preferences.
 */
export interface UserSettings {
  id: number
  user: User
  showOnlineStatus: boolean
  notificationEnabled?: boolean
  theme: Theme
}


/**
 * User profile details.
 */
export interface UserProfile {
  avatar?: string
  bio?: string
  createdAt: string
  email: string
  id: number
  isOnline: boolean
  lastSeen?: string
  name: string
  updatedAt: string
}

export interface ExportUser {
  user: User
  groups: Group[]
} 

/**
 * Request to update user profile.
 */
export interface UpdateProfileRequest {
  bio: string
  name: string
}

export interface UpdateUserStatusRequest {
  status: 'active' | 'blocked' 
}

export interface UpdateUserSettingsRequest {
  theme?: Theme
  notificationEnable?: boolean
  showOnlineStatus?: boolean
  status?: 'active' | 'blocked' | 'suspended'
}
