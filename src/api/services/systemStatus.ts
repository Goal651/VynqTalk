import { apiClient } from '@/api';
import { API_ENDPOINTS } from '@/api';

export interface SystemStatus {
  inMaintenance: boolean;
  message: string;
}

export const systemStatusService = {
  async getStatus(): Promise<SystemStatus> {
    const res = await apiClient.get<SystemStatus>(API_ENDPOINTS.SYSTEM.STATUS);
    return res.data;
  },
  async setStatus(inMaintenance: boolean, message: string) {
    const params = new URLSearchParams({
      inMaintenance: String(inMaintenance),
      message
    }).toString();
    const endpoint = `${API_ENDPOINTS.SYSTEM.STATUS}?${params}`;
    return apiClient.put(endpoint, null);
  }
}; 