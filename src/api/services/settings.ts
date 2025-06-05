
import { UserSettings } from '@/types';
import { apiClient } from '../client';
import { API_ENDPOINTS } from '../constants';
import { ApiResponse } from '../types';



export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showOnlineStatus: boolean;
  allowMessageRequests: boolean;
  readReceipts: boolean;
  blockedUsers: string[];
}

export class SettingsService {
  async getSettings(userId: number): Promise<ApiResponse<UserSettings>> {
    return await apiClient.get<UserSettings>(API_ENDPOINTS.SETTINGS.GET(userId));
  }

  async updateSettings(userId: number, settings: UserSettings): Promise<ApiResponse<UserSettings>> {
    return await apiClient.put<UserSettings>(API_ENDPOINTS.SETTINGS.UPDATE(userId), settings);
  }

  async getPrivacySettings(userId: number): Promise<ApiResponse<PrivacySettings>> {
    return await apiClient.get<PrivacySettings>(API_ENDPOINTS.SETTINGS.PRIVACY(userId));
  }

  async updatePrivacySettings(userId: number, settings: Partial<PrivacySettings>): Promise<ApiResponse<PrivacySettings>> {
    return await apiClient.put<PrivacySettings>(API_ENDPOINTS.SETTINGS.PRIVACY(userId), settings);
  }

  async updateTheme(userId: number, theme: "blue" | "dark" | "cyberpunk" | "neon" | "ocean" | "sunset"): Promise<ApiResponse<void>> {
    return await apiClient.put<void>(API_ENDPOINTS.SETTINGS.THEME(userId), { theme });
  }

  async blockUser(userId: number): Promise<ApiResponse<void>> {
    return await apiClient.post<void>(API_ENDPOINTS.SETTINGS.BLOCK_USER(userId), { userId });
  }

  async unblockUser(userId: number): Promise<ApiResponse<void>> {
    return await apiClient.post<void>(API_ENDPOINTS.SETTINGS.UNBLOCK_USER(userId), { userId });
  }
}

export const settingsService = new SettingsService();
