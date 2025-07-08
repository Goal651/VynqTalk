import { Group, User, ApiResponse, SystemMetric, Alert, AdminStats, UpdateUserStatusRequest, ChartData } from '@/types';
import { apiClient } from '@/api';
import { API_ENDPOINTS } from '@/api';

export class AdminService {
  // User Management
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return await apiClient.get<User[]>(API_ENDPOINTS.ADMIN.USERS);
  }

  async getUserById(id: number): Promise<ApiResponse<User>> {
    return await apiClient.get<User>(API_ENDPOINTS.ADMIN.USER_BY_ID(id));
  }

  async updateUser(id: number, updates: UpdateUserStatusRequest): Promise<ApiResponse> {
    return await apiClient.put(API_ENDPOINTS.ADMIN.UPDATE_USER(id), updates);
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
  /**
   * Fetch daily statistics for admin analytics (ChartData[]).
   * Each entry includes: date, activeUsers, newUsers, messages.
   */
  async getAnalytics(): Promise<ApiResponse<ChartData[]>> {
    return await apiClient.get<ChartData[]>(API_ENDPOINTS.ADMIN.ANALYTICS);
  }

  async getSystemMetrics(): Promise<ApiResponse<SystemMetric[]>> {
    return await apiClient.get<SystemMetric[]>(API_ENDPOINTS.ADMIN.METRICS);
  }

  async getAdminStats(): Promise<ApiResponse<AdminStats>> {
    return await apiClient.get<AdminStats>('/admin/stats');
  }

  async getDashboardStats(): Promise<ApiResponse<AdminStats>> {
    return await apiClient.get<AdminStats>(API_ENDPOINTS.ADMIN.DASHBOARD_STATS);
  }

  async getRecentAlerts(): Promise<ApiResponse<Alert[]>> {
      return await apiClient.get<Alert[]>(API_ENDPOINTS.ADMIN.RECENT_ALERTS);
  }
}

export const adminService = new AdminService();
