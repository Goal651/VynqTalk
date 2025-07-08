import { authService } from './auth';
import { User, ApiResponse, ExportUser, UpdateProfileRequest } from '@/types';
import { apiClient } from '@/api';
import { API_ENDPOINTS } from '@/api';

export class UserService {
  /**
   * Fetch all users. Each user may now include:
   * - latestMessage: Message | null
   * - online: boolean (if privacy allows)
   */
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return await apiClient.get<User[]>(API_ENDPOINTS.USER.ALL);
  }

  /**
   * Fetch a user by ID. For the logged-in user, may include:
   * - unreadMessages: Message[]
   */
  async getUserById(id: string): Promise<ApiResponse<User>> {
    return await apiClient.get<User>(API_ENDPOINTS.USER.BY_ID(id));
  }


  async deleteUser(): Promise<ApiResponse<void>> {
    return await apiClient.delete<void>(API_ENDPOINTS.USER.DELETE);
  }


  async updateProfile(updates: UpdateProfileRequest): Promise<ApiResponse> {
    const response = await apiClient.put(API_ENDPOINTS.USER.UPDATE, updates);
    await authService.refreshUser()
    return response
  }

  async uploadAvatar(file: File): Promise<ApiResponse<string>> {
    return await apiClient.uploadFile<string>(API_ENDPOINTS.USER.UPLOAD_AVATAR, file);
  }



  /**
   * Fetch the logged-in user's data (profile + groups).
   * The user object may now include unreadMessages.
   */
  async getUserData(): Promise<ApiResponse<User>> {
    return await apiClient.get<User>(API_ENDPOINTS.USER.GET_DATA)
  }

  async exportUser(): Promise<ApiResponse<ExportUser>> {
    return await apiClient.get<ExportUser>(API_ENDPOINTS.USER.EXPORT)
  }
}

export const userService = new UserService();
