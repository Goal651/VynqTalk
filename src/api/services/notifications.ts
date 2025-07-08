import { Notification, NotificationSettings, ApiResponse } from '@/types';
import { apiClient } from '@/api';
import { API_ENDPOINTS } from '@/api';

export class NotificationService {
  async getAllNotifications(userId: number): Promise<ApiResponse<Notification[]>> {
    return await apiClient.get<Notification[]>(API_ENDPOINTS.NOTIFICATIONS.LIST(userId));
  }

  async getNotificationById(id: number): Promise<ApiResponse<Notification>> {
    return await apiClient.get<Notification>(API_ENDPOINTS.NOTIFICATIONS.BY_ID(id));
  }

  async markAsRead(id: number): Promise<ApiResponse<void>> {
    return await apiClient.put<void>(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
  }

  async markAllAsRead(userId: number): Promise<ApiResponse<void>> {
    return await apiClient.put<void>(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ(userId));
  }

  async deleteNotification(id: number): Promise<ApiResponse<void>> {
    return await apiClient.delete<void>(API_ENDPOINTS.NOTIFICATIONS.DELETE(id));
  }

  async getNotificationSettings(userId: number): Promise<ApiResponse<NotificationSettings>> {
    return await apiClient.get<NotificationSettings>(API_ENDPOINTS.NOTIFICATIONS.SETTINGS(userId));
  }

  async updateNotificationSettings(userId: number, settings: Partial<NotificationSettings>): Promise<ApiResponse<NotificationSettings>> {
    return await apiClient.put<NotificationSettings>(API_ENDPOINTS.NOTIFICATIONS.SETTINGS(userId), settings);
  }

  async registerDevice(subscription: PushSubscription) {
    return apiClient.post(API_ENDPOINTS.NOTIFICATIONS.DEVICE_REGISTER, { subscription });
  }

  async unregisterDevice(subscription: PushSubscription) {
    return apiClient.post(API_ENDPOINTS.NOTIFICATIONS.DEVICE_UNREGISTER, { subscription });
  }
}

export const notificationService = new NotificationService();
