import { ApiResponse, User, LoginRequest, SignupRequest, AuthResponse, RefreshTokenRequest, ForgotPasswordRequest, ResetPasswordRequest } from '@/types'
import { apiClient } from '@/api';
import { API_ENDPOINTS } from '@/api';

/**
 * Service for authentication-related API calls and local storage management.
 */
export class AuthService {
  /**
   * Log in a user and store tokens.
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    )
    if (response.success && response.data) {
      localStorage.setItem('access_token', response.data.accessToken)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response
  }

  /**
   * Sign up a new user and store tokens.
   */
  async signup(userData: SignupRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.SIGNUP,
      userData
    )
    if (response.success && response.data) {
      localStorage.setItem('access_token', response.data.accessToken)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response
  }

  /**
   * Verify logged in user
   */
  async checkToken(): Promise<ApiResponse<User>> {
    return await apiClient.get<User>(API_ENDPOINTS.AUTH.VERIFY_USER)
  }

  /**
   * Log out the user and clear tokens.
   */
  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT, {
        refreshToken: localStorage.getItem('refresh_token'),
      })
      localStorage.clear()
      return response
    } catch (error) {
      localStorage.clear()
      throw error
    }
  }

  /**
   * Refresh the access token using the refresh token.
   */
  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken } as RefreshTokenRequest
    )
    if (response.success && response.data) {
      localStorage.setItem('access_token', response.data.accessToken)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response
  }

  /**
   * Request a password reset email.
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data)
  }

  /**
   * Reset the user's password.
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.AUTH.RESET_PASSWORD, data)
  }



  async refreshUser(): Promise<User> {
    try {
      const response = await this.checkToken()
      if (response.data) localStorage.setItem('user', JSON.stringify(response.data))
      return response.data
    } catch (error) {
      console.error('Refresh user error:', error)
    }
  }

  /**
   * Check if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token')
  }

  /**
   * Get the stored user from localStorage.
   */
  getStoredUser(): User | null {
    try {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    }
    catch (error) {
      localStorage.clear()
    }
  }

}

export const authService = new AuthService()
