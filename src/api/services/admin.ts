
import { Group, User } from '@/types';
import { AdminMessage, SystemMetric } from '@/pages/admin/types';
import { apiClient } from '../client';
import { API_ENDPOINTS } from '../constants';
import { ApiResponse } from '../types';

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalGroups: number;
  totalMessages: number;
  flaggedContent: number;
}

export class AdminService {
  // User Management
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return await apiClient.get<User[]>(API_ENDPOINTS.ADMIN.USERS);
  }

  async getUserById(id: number): Promise<ApiResponse<User>> {
    return await apiClient.get<User>(API_ENDPOINTS.ADMIN.USER_BY_ID(id));
  }

  async updateUser(id: number, updates: User): Promise<ApiResponse<User>> {
    return await apiClient.put<User>(API_ENDPOINTS.ADMIN.UPDATE_USER(id), updates);
  }

  async deleteUser(id: number): Promise<ApiResponse<void>> {
    return await apiClient.delete<void>(API_ENDPOINTS.ADMIN.DELETE_USER(id));
  }


  // Group Management
  async getAllGroups(): Promise<ApiResponse<Group[]>> {
    return await apiClient.get<Group[]>(API_ENDPOINTS.ADMIN.GROUPS);
  }

  async getGroupById(id: number): Promise<ApiResponse<Group>> {
    return await apiClient.get<Group>(API_ENDPOINTS.ADMIN.GROUP_BY_ID(id));
  }

  async suspendGroup(id: number): Promise<ApiResponse<void>> {
    return await apiClient.put<void>(`${API_ENDPOINTS.ADMIN.GROUP_BY_ID(id)}/suspend`);
  }

  async activateGroup(id: number): Promise<ApiResponse<void>> {
    return await apiClient.put<void>(`${API_ENDPOINTS.ADMIN.GROUP_BY_ID(id)}/activate`);
  }

  // Content Moderation
  async getAllMessages(): Promise<ApiResponse<AdminMessage[]>> {
    return await apiClient.get<AdminMessage[]>(API_ENDPOINTS.ADMIN.MESSAGES);
  }

  async getMessageById(id: number): Promise<ApiResponse<AdminMessage>> {
    return await apiClient.get<AdminMessage>(API_ENDPOINTS.ADMIN.MESSAGE_BY_ID(id));
  }

  async approveMessage(id: number): Promise<ApiResponse<void>> {
    return await apiClient.put<void>(`${API_ENDPOINTS.ADMIN.MESSAGE_BY_ID(id)}/approve`);
  }

  async flagMessage(id: number): Promise<ApiResponse<void>> {
    return await apiClient.put<void>(`${API_ENDPOINTS.ADMIN.MESSAGE_BY_ID(id)}/flag`);
  }

  async deleteMessage(id: number): Promise<ApiResponse<void>> {
    return await apiClient.delete<void>(API_ENDPOINTS.ADMIN.MESSAGE_BY_ID(id));
  }

  // Analytics & Metrics
  async getAnalytics(): Promise<ApiResponse<unknown>> {
    return await apiClient.get<unknown>(API_ENDPOINTS.ADMIN.ANALYTICS);
  }

  async getSystemMetrics(): Promise<ApiResponse<SystemMetric[]>> {
    return await apiClient.get<SystemMetric[]>(API_ENDPOINTS.ADMIN.METRICS);
  }

  async getAdminStats(): Promise<ApiResponse<AdminStats>> {
    return await apiClient.get<AdminStats>('/admin/stats');
  }
}

export const adminService = new AdminService();
