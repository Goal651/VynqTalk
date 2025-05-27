
// API Configuration Constants
export const API_CONFIG = {
  BASE_URL: 'http://localhost:4000',
  API_VERSION: 'v1',
  TIMEOUT: 10000,
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    UPLOAD_AVATAR: '/user/avatar',
  },
  CHAT: {
    MESSAGES: '/chat/messages',
    SEND_MESSAGE: '/chat/send',
    CONVERSATIONS: '/chat/conversations',
  },
  GROUPS: {
    LIST: '/groups',
    CREATE: '/groups',
    JOIN: '/groups/join',
    LEAVE: '/groups/leave',
  },
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const SOCKET_EVENTS = {
  SEND_MESSAGE: 'chat:send',
  RECEIVE_MESSAGE: 'chat:receive',
  USER_TYPING: 'user:typing',
  USER_STOP_TYPING: 'user:stopTyping',
};
