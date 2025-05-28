
import { User } from '@/types';
import { AdminUser, AdminGroup, AdminMessage } from '@/pages/admin/types';
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

export interface SystemMetrics {
  serverUptime: string;
  responseTime: string;
  activeConnections: number;
  storageUsed: number;
  memoryUsage: number;
  cpuUsage: number;
}

export class AdminService {
  // User Management
  async getAllUsers(): Promise<ApiResponse<AdminUser[]>> {
    return await apiClient.get<AdminUser[]>(API_ENDPOINTS.ADMIN.USERS);
  }

  async getUserById(id: string): Promise<ApiResponse<AdminUser>> {
    return await apiClient.get<AdminUser>(API_ENDPOINTS.ADMIN.USER_BY_ID(id));
  }

  async updateUser(id: string, updates: Partial<AdminUser>): Promise<ApiResponse<AdminUser>> {
    return await apiClient.put<AdminUser>(API_ENDPOINTS.ADMIN.UPDATE_USER(id), updates);
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return await apiClient.delete<void>(API_ENDPOINTS.ADMIN.DELETE_USER(id));
  }

  async blockUser(id: string): Promise<ApiResponse<void>> {
    return await apiClient.put<void>(`${API_ENDPOINTS.ADMIN.UPDATE_USER(id)}/block`);
  }

  async unblockUser(id: string): Promise<ApiResponse<void>> {
    return await apiClient.put<void>(`${API_ENDPOINTS.ADMIN.UPDATE_USER(id)}/unblock`);
  }

  // Group Management
  async getAllGroups(): Promise<ApiResponse<AdminGroup[]>> {
    return await apiClient.get<AdminGroup[]>(API_ENDPOINTS.ADMIN.GROUPS);
  }

  async getGroupById(id: string): Promise<ApiResponse<AdminGroup>> {
    return await apiClient.get<AdminGroup>(API_ENDPOINTS.ADMIN.GROUP_BY_ID(id));
  }

  async suspendGroup(id: string): Promise<ApiResponse<void>> {
    return await apiClient.put<void>(`${API_ENDPOINTS.ADMIN.GROUP_BY_ID(id)}/suspend`);
  }

  async activateGroup(id: string): Promise<ApiResponse<void>> {
    return await apiClient.put<void>(`${API_ENDPOINTS.ADMIN.GROUP_BY_ID(id)}/activate`);
  }

  // Content Moderation
  async getAllMessages(): Promise<ApiResponse<AdminMessage[]>> {
    return await apiClient.get<AdminMessage[]>(API_ENDPOINTS.ADMIN.MESSAGES);
  }

  async getMessageById(id: string): Promise<ApiResponse<AdminMessage>> {
    return await apiClient.get<AdminMessage>(API_ENDPOINTS.ADMIN.MESSAGE_BY_ID(id));
  }

  async approveMessage(id: string): Promise<ApiResponse<void>> {
    return await apiClient.put<void>(`${API_ENDPOINTS.ADMIN.MESSAGE_BY_ID(id)}/approve`);
  }

  async flagMessage(id: string): Promise<ApiResponse<void>> {
    return await apiClient.put<void>(`${API_ENDPOINTS.ADMIN.MESSAGE_BY_ID(id)}/flag`);
  }

  async deleteMessage(id: string): Promise<ApiResponse<void>> {
    return await apiClient.delete<void>(API_ENDPOINTS.ADMIN.MESSAGE_BY_ID(id));
  }

  // Analytics & Metrics
  async getAnalytics(): Promise<ApiResponse<any>> {
    return await apiClient.get<any>(API_ENDPOINTS.ADMIN.ANALYTICS);
  }

  async getSystemMetrics(): Promise<ApiResponse<SystemMetrics>> {
    return await apiClient.get<SystemMetrics>(API_ENDPOINTS.ADMIN.METRICS);
  }

  async getAdminStats(): Promise<ApiResponse<AdminStats>> {
    return await apiClient.get<AdminStats>('/admin/stats');
  }
}

export const adminService = new AdminService();
