import { Theme } from "./system"

/**
 * Request to update user profile.
 */
export interface UpdateProfileRequest {
    bio?: string
    name?: string
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

/**
 * Request payload for sending a direct message.
 */
export interface SendMessageRequest {
    content: string
    receiverId: number
    senderId: number
    type?: "TEXT" | "IMAGE" | "AUDIO" | "FILE"
    replyToId?: number
}

/**
 * Request payload for sending a group message.
 */
export interface SendGroupMessageRequest {
    content: string
    groupId: number
    type?: "TEXT" | "IMAGE" | "AUDIO" | "FILE"
    replyToId?: number
}

/**
 * Group types.
 */
export interface CreateGroupRequest {
    name: string
    description?: string
    isPrivate: boolean
}


export interface RefreshTokenRequest {
    refreshToken: string
}

export interface ForgotPasswordRequest {
    email: string
}

export interface ResetPasswordRequest {
    token: string
    password: string
    confirmPassword: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface SignupRequest {
    name: string
    email: string
    password: string
}