
import { apiClient } from '../client';
import { API_ENDPOINTS } from '../constants';
import { ApiResponse } from '../types';

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundEnabled: boolean;
  autoStatus: boolean;
  showOnlineStatus: boolean;
  readReceipts: boolean;
  profileVisibility: 'public' | 'friends' | 'private';
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showOnlineStatus: boolean;
  allowMessageRequests: boolean;
  readReceipts: boolean;
  blockedUsers: string[];
}

export class SettingsService {
  async getSettings(): Promise<ApiResponse<UserSettings>> {
    return await apiClient.get<UserSettings>(API_ENDPOINTS.SETTINGS.GET);
  }

  async updateSettings(settings: Partial<UserSettings>): Promise<ApiResponse<UserSettings>> {
    return await apiClient.put<UserSettings>(API_ENDPOINTS.SETTINGS.UPDATE, settings);
  }

  async getPrivacySettings(): Promise<ApiResponse<PrivacySettings>> {
    return await apiClient.get<PrivacySettings>(API_ENDPOINTS.SETTINGS.PRIVACY);
  }

  async updatePrivacySettings(settings: Partial<PrivacySettings>): Promise<ApiResponse<PrivacySettings>> {
    return await apiClient.put<PrivacySettings>(API_ENDPOINTS.SETTINGS.PRIVACY, settings);
  }

  async updateTheme(theme: 'light' | 'dark' | 'system'): Promise<ApiResponse<void>> {
    return await apiClient.put<void>(API_ENDPOINTS.SETTINGS.THEME, { theme });
  }

  async blockUser(userId: string): Promise<ApiResponse<void>> {
    return await apiClient.post<void>('/settings/block-user', { userId });
  }

  async unblockUser(userId: string): Promise<ApiResponse<void>> {
    return await apiClient.post<void>('/settings/unblock-user', { userId });
  }
}

export const settingsService = new SettingsService();
