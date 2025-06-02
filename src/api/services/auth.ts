
import { Alert } from '@/components/ui/alert';
import { apiClient } from '../client';
import { API_ENDPOINTS } from '../constants';
import {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ApiResponse,
} from '../types';

export class AuthService {
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    if (response.success && response.data) {
      // Store tokens in localStorage
      localStorage.setItem('access_token', response.data.accessToken);
      localStorage.setItem('lavable-user', JSON.stringify(response.data.user));
    }

    return response;
  }

  async signup(userData: SignupRequest): Promise<ApiResponse<AuthResponse>> {

    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.SIGNUP,
      userData
    );

    if (response.success && response.data) {
      // Store tokens in localStorage
      localStorage.setItem('access_token', response.data.accessToken);
      localStorage.setItem('lavable-user', JSON.stringify(response.data.user));
    }

    return response;
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT, {
        refreshToken: localStorage.getItem('refresh_token'),
      });

      // Clear stored tokens regardless of API response
      this.clearTokens();

      return response;
    } catch (error) {
      // Clear tokens even if logout API call fails
      this.clearTokens();
      throw error;
    }
  }

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken } as RefreshTokenRequest
    );

    if (response.success && response.data) {
      localStorage.setItem('access_token', response.data.accessToken);
      localStorage.setItem('lavable-user', JSON.stringify(response.data.user));
    }

    return response;
  }

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      email,
    } as ForgotPasswordRequest);
  }

  async resetPassword(token: string, password: string, confirmPassword: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      password,
      confirmPassword,
    } as ResetPasswordRequest);
  }

  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
  }

  private clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('lavable-user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getStoredUser() {
    const user = localStorage.getItem('lavable-user');
    return user ? JSON.parse(user) : null;
  }
}

export const authService = new AuthService();
