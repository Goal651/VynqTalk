import { UserSettings, ApiResponse, UpdateUserSettingsRequest } from '@/types';
import { apiClient } from '@/api';
import { API_ENDPOINTS } from '@/api';

export class SettingsService {
  async getSettings(): Promise<ApiResponse<UserSettings>> {
    return await apiClient.get<UserSettings>(API_ENDPOINTS.SETTINGS.GET);
  }

  async updateSettings(settings: UpdateUserSettingsRequest): Promise<ApiResponse<UserSettings>> {
    return await apiClient.put<UserSettings>(API_ENDPOINTS.SETTINGS.UPDATE, settings);
  }

}

export const settingsService = new SettingsService();
