import { User, ApiResponse, UpdateUserRequest } from '@/types';
import { apiClient } from '../client';
import { API_ENDPOINTS } from '../constants';

export class UserService {
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return await apiClient.get<User[]>(API_ENDPOINTS.USER.ALL);
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return await apiClient.get<User>(API_ENDPOINTS.USER.BY_ID(id));
  }

  async updateUser(id: string, updates: UpdateUserRequest): Promise<ApiResponse<User>> {
    return await apiClient.put<User>(API_ENDPOINTS.USER.UPDATE(id), updates);
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return await apiClient.delete<void>(API_ENDPOINTS.USER.DELETE(id));
  }


  async updateProfile(id:number,updates:User): Promise<ApiResponse<User>> {
    return await apiClient.put<User>(API_ENDPOINTS.USER.UPDATE(id),updates);
  }

  async uploadAvatar(id:number,file: File): Promise<ApiResponse<string>> {
    return await apiClient.uploadFile<string>(API_ENDPOINTS.USER.UPLOAD_AVATAR(id), file);
  }

  async blockUser(userId: string): Promise<ApiResponse<void>> {
    return await apiClient.post<void>('/users/block', { userId });
  }

  async unblockUser(userId: string): Promise<ApiResponse<void>> {
    return await apiClient.post<void>('/users/unblock', { userId });
  }

  async getOnlineUsers(): Promise<ApiResponse<User[]>> {
    return await apiClient.get<User[]>('/users/online');
  }
}

export const userService = new UserService();
