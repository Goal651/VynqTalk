import { authService } from './auth';
import { User, ApiResponse, ExportUser, UpdateProfileRequest } from '@/types';
import { apiClient } from '../client';
import { API_ENDPOINTS } from '../constants';

export class UserService {
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return await apiClient.get<User[]>(API_ENDPOINTS.USER.ALL);
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return await apiClient.get<User>(API_ENDPOINTS.USER.BY_ID(id));
  }


  async deleteUser(): Promise<ApiResponse<void>> {
    return await apiClient.delete<void>(API_ENDPOINTS.USER.DELETE);
  }


  async updateProfile( updates: UpdateProfileRequest): Promise<ApiResponse> {
    const response=await apiClient.put(API_ENDPOINTS.USER.UPDATE, updates);
    await authService.refreshUser()
    return response 
  }

  async uploadAvatar( file: File): Promise<ApiResponse<string>> {
    return await apiClient.uploadFile<string>(API_ENDPOINTS.USER.UPLOAD_AVATAR, file);
  }



  async getUserData(): Promise<ApiResponse<ExportUser>> {
    return await apiClient.get<ExportUser>(API_ENDPOINTS.USER.EXPORT)
  }
}

export const userService = new UserService();
