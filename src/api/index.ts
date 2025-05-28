
// Export all API services and utilities
export { apiClient } from './client';
export { authService } from './services/auth';
export { userService } from './services/users';
export { messageService } from './services/messages';
export { groupService } from './services/groups';
export { notificationService } from './services/notifications';
export { settingsService } from './services/settings';
export { adminService } from './services/admin';
export { socketService } from './services/socket';
export { API_CONFIG, API_ENDPOINTS, HTTP_STATUS, SOCKET_EVENTS } from './constants';
export type * from './types';

// Re-export commonly used types
export type {
  ApiResponse,
  LoginRequest,
  SignupRequest,
  AuthResponse,
  ApiError,
  SendMessageRequest,
  UpdateProfileRequest,
} from './types';
