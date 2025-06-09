
import { User } from '@/types';
import { apiClient } from '../client';
import { API_ENDPOINTS } from '../constants';
import { ApiResponse, UpdateProfileRequest } from '../types';

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  avatar?: string;
  isAdmin?: boolean;
  status?: 'active' | 'blocked' | 'suspended';
}

export class UserService {
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return await apiClient.get<User[]>(API_ENDPOINTS.USERS.ALL);
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return await apiClient.get<User>(API_ENDPOINTS.USERS.BY_ID(id));
  }

  async updateUser(id: string, updates: UpdateUserRequest): Promise<ApiResponse<User>> {
    return await apiClient.put<User>(API_ENDPOINTS.USERS.UPDATE(id), updates);
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return await apiClient.delete<void>(API_ENDPOINTS.USERS.DELETE(id));
  }

  async searchUsers(query: string): Promise<ApiResponse<User[]>> {
    return await apiClient.get<User[]>(API_ENDPOINTS.USERS.SEARCH, { q: query });
  }

  async updateProfile(id:number,updates:User): Promise<ApiResponse<User>> {
    return await apiClient.put<User>(API_ENDPOINTS.USERS.UPDATE(id),updates);
  }

  async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    return await apiClient.uploadFile<{ avatarUrl: string }>(API_ENDPOINTS.USER.UPLOAD_AVATAR, file);
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
