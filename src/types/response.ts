import { User } from "@/types"

export interface AuthResponse {
    accessToken: string
    refreshToken: string
    user: User
  }
  
