

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