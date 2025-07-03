/**
 * Request to update user profile.
 */
export interface UpdateProfileRequest {
    avatar?: string;
    email?: string;
    name?: string;
}

export interface UpdateUserRequest {
    avatar?: string;
    email?: string;
    userRole?: "USER" | "ADMIN";
    name?: string;
    status?: 'active' | 'blocked' | 'suspended';
}

/**
 * Request payload for sending a direct message.
 */
export interface SendMessageRequest {
    content: string;
    receiverId: number;
    senderId: number;
    type?: "TEXT" | "IMAGE" | "AUDIO" | "FILE";
    replyToId?: number;
}

/**
 * Request payload for sending a group message.
 */
export interface SendGroupMessageRequest {
    content: string;
    groupId: number;
    type?: "TEXT" | "IMAGE" | "AUDIO" | "FILE";
    replyToId?: number;
}

/**
 * Group types.
 */
export interface CreateGroupRequest {
    name: string;
    description?: string;
    isPrivate: boolean;
}


export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    password: string;
    confirmPassword: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    name: string;
    email: string;
    password: string;
}