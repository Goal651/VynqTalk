
// Base API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    isOnline: boolean;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
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

// User Types
export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

// Chat Types
export interface SendMessageRequest {
  content: string;
  type: 'text' | 'image' | 'audio' | 'file';
  chatWithUserId?: string;
  groupId?: string;
  replyToId?: string;
}

export interface MessageResponse {
  id: string;
  content: string;
  type: 'text' | 'image' | 'audio' | 'file';
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: string;
  isEdited: boolean;
  reactions: Array<{
    id: string;
    emoji: string;
    userId: string;
    userName: string;
  }>;
  replyTo?: {
    messageId: string;
    userId: string;
    userName: string;
    content: string;
  };
}

export interface ConversationResponse {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  avatar?: string;
  participants: UserProfile[];
  lastMessage?: MessageResponse;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

// Group Types
export interface CreateGroupRequest {
  name: string;
  description?: string;
  avatar?: string;
  isPrivate: boolean;
  members: string[];
}

export interface GroupResponse {
  id: string;
  name: string;
  description?: string;
  avatar: string;
  members: UserProfile[];
  createdBy: string;
  createdAt: string;
  isPrivate: boolean;
}

// Error Types
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}
