import { User } from "@/types";

export interface AuthResponse {
    accessToken: string;
    user: User;
  }
  