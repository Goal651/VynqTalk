import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG, HTTP_STATUS } from './constants';
import { ApiResponse, ApiError } from './types';

class ApiClient {
  private axiosInstance: AxiosInstance;
  private logoutListeners: (() => void)[] = [];
  private refreshAttempts: number = 0;
  private maxRefreshAttempts: number = 3;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.API_VERSION}`,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        try {
          if (config.url?.includes('/auth')) {
            return config;
          }
          const token = this.getAuthToken();
          if (!token) {
            console.warn('No access token found, triggering logout');
            this.logout();
            throw new Error('Missing access token');
          }
          config.headers.Authorization = `Bearer ${token}`;
          return config;
        } catch (error) {
          console.error('Error in request interceptor:', error.message);
          return Promise.reject(error);
        }
      },
      (error) => {
        console.error('Request interceptor error:', error.message);
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        try {
          if (error.response) {
            const apiError: ApiError = {
              status: error.status,
              message: error?.message || 'An error occurred',
              errors: error.errors,
            };
            if (apiError.status === HTTP_STATUS.UNAUTHORIZED||apiError.status === HTTP_STATUS.FORBIDDEN) {
              console.warn('401 Unauthorized detected, attempting token refresh');
              await this.handleUnauthorized();
              // Retry the original request after refresh
              return this.axiosInstance.request(error.config);
            }
            throw apiError;
          }
          if (error.code === 'ECONNABORTED') {
            throw new Error('Request timeout');
          }
          throw new Error('Network error');
        } catch (err) {
          console.error('Error in response interceptor:', err.message,"this is another error\n",error.status===HTTP_STATUS.UNAUTHORIZED);
          return Promise.reject(err);
        }
      }
    );
  }

  private getAuthToken(): string | null {
    try {
      return localStorage.getItem('access_token');
    } catch (error) {
      console.error('Error accessing localStorage:', error.message);
      this.logout();
      return null;
    }
  }

  private async handleUnauthorized() {
    try {
      if (this.refreshAttempts >= this.maxRefreshAttempts) {
        console.warn('Max refresh attempts reached, logging out');
        this.logout();
        throw new Error('Max refresh attempts exceeded');
      }
      this.refreshAttempts++;
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/api/${API_CONFIG.API_VERSION}/auth/refresh`,
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.status === HTTP_STATUS.OK) {
        const { accessToken } = response.data;
        localStorage.setItem('access_token', accessToken);
        console.log('Token refreshed successfully');
        this.refreshAttempts = 0;
      } else {
        throw new Error('Refresh token invalid or expired');
      }
    } catch (error) {
      console.error('Failed to refresh token:', error.message);
      this.logout();
      throw error;
    }
  }

  public async logout() {
    try {
      console.log('Logging out user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      this.logoutListeners.forEach((callback) => {
        try {
          callback();
        } catch (error) {
          console.error('Error in logout callback:', error.message);
        }
      });
      window.window.location.reload()
    } catch (error) {
      console.error('Error during logout:', error.message);
    } finally {
      this.logoutListeners.forEach((callback) => {
        try {
          callback();
        } catch (error) {
          console.error('Error in final logout callback:', error.message);
        }
      });
    }
  }

  public onLogout(callback: () => void) {
    try {
      this.logoutListeners.push(callback);
    } catch (error) {
      console.error('Error adding logout listener:', error.message);
    }
  }

  public removeLogoutListener(callback: () => void) {
    try {
      this.logoutListeners = this.logoutListeners.filter(cb => cb !== callback);
    } catch (error) {
      console.error('Error removing logout listener:', error.message);
    }
  }

  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get<ApiResponse<T>>(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error.message);
      if (error.status === HTTP_STATUS.UNAUTHORIZED) {
        await this.handleUnauthorized();
        return this.get<T>(endpoint, params); // Retry
      }
      throw error;
    }
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<ApiResponse<T>>(endpoint, data);
      console.log("This is the response",response,"endpoint",endpoint)
      return response.data;
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error.request);
      if (error.status === HTTP_STATUS.UNAUTHORIZED) {
        await this.handleUnauthorized();
        return this.post<T>(endpoint, data); // Retry
      }
      throw error;
    }
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put<ApiResponse<T>>(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`PUT ${endpoint} failed:`, error.message);
      if (error.status === HTTP_STATUS.UNAUTHORIZED) {
        await this.handleUnauthorized();
        return this.put<T>(endpoint, data); // Retry
      }
      throw error;
    }
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.patch<ApiResponse<T>>(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`PATCH ${endpoint} failed:`, error.message);
      if (error.status === HTTP_STATUS.UNAUTHORIZED) {
        await this.handleUnauthorized();
        return this.patch<T>(endpoint, data); // Retry
      }
      throw error;
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<ApiResponse<T>>(endpoint);
      return response.data;
    } catch (error) {
      console.error(`DELETE ${endpoint} failed:`, error.message);
      if (error.status === HTTP_STATUS.UNAUTHORIZED) {
        await this.handleUnauthorized();
        return this.delete<T>(endpoint); // Retry
      }
      throw error;
    }
  }

  async uploadFile<T>(endpoint: string, file: File): Promise<ApiResponse<T>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await this.axiosInstance.post<ApiResponse<T>>(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`UPLOAD ${endpoint} failed:`, error.message);
      if (error.status === HTTP_STATUS.UNAUTHORIZED) {
        await this.handleUnauthorized();
        return this.uploadFile<T>(endpoint, file); // Retry
      }
      throw error;
    }
  }
}

export const apiClient = new ApiClient();