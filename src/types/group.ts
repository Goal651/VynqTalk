/**
 * Represents a group chat.
 */
import type { User } from "./user"

export interface Group {
  id: number
  name: string
  description: string
  avatar: string
  members: User[]
  admins: User[]
  status: "active" | "suspended"
  createdBy: User
  createdAt: string
  isPrivate?: boolean
}


/**
 * Group types.
 */
export interface CreateGroupRequest {
  name: string
  description?: string
  isPrivate: boolean
}

export interface UpdateGroupRequest {
  name: string
  description: string
  isPrivate?: boolean
}