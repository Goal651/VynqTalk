import { apiClient } from '../client';
import { API_ENDPOINTS } from '../constants';

export interface SystemStatus {
  inMaintenance: boolean;
  message: string;
}

export const systemStatusService = {
  async getStatus(): Promise<SystemStatus> {
    const res = await apiClient.get<SystemStatus>(API_ENDPOINTS.ADMIN.SYSTEM_STATUS);
    return res.data;
  },
  async setStatus(inMaintenance: boolean, message: string) {
    // Manually construct the query string
    const params = new URLSearchParams({
      inMaintenance: String(inMaintenance),
      message
    }).toString();
    const endpoint = `${API_ENDPOINTS.ADMIN.SYSTEM_STATUS}?${params}`;
    return apiClient.put(endpoint, null);
  }
}; 