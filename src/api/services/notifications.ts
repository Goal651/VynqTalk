
import { Notification } from '@/types';
import { apiClient } from '../client';
import { API_ENDPOINTS } from '../constants';
import { ApiResponse } from '../types';

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  messageNotifications: boolean;
  groupNotifications: boolean;
  mentionNotifications: boolean;
}

export class NotificationService {
  async getAllNotifications(): Promise<ApiResponse<Notification[]>> {
    return await apiClient.get<Notification[]>(API_ENDPOINTS.NOTIFICATIONS.LIST);
  }

  async getNotificationById(id: string): Promise<ApiResponse<Notification>> {
    return await apiClient.get<Notification>(API_ENDPOINTS.NOTIFICATIONS.BY_ID(id));
  }

  async markAsRead(id: string): Promise<ApiResponse<void>> {
    return await apiClient.put<void>(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
  }

  async markAllAsRead(): Promise<ApiResponse<void>> {
    return await apiClient.put<void>(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
  }

  async deleteNotification(id: string): Promise<ApiResponse<void>> {
    return await apiClient.delete<void>(API_ENDPOINTS.NOTIFICATIONS.DELETE(id));
  }

  async getNotificationSettings(): Promise<ApiResponse<NotificationSettings>> {
    return await apiClient.get<NotificationSettings>(API_ENDPOINTS.NOTIFICATIONS.SETTINGS);
  }

  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<ApiResponse<NotificationSettings>> {
    return await apiClient.put<NotificationSettings>(API_ENDPOINTS.NOTIFICATIONS.SETTINGS, settings);
  }
}

export const notificationService = new NotificationService();
