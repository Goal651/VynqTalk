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
    UPDATE_SETTINGS: '/user/settings',
    GET_SETTINGS: '/user/settings',
  },
  USERS: {
    ALL: '/users',
    BY_ID: (id: number | string) => `/users/${id}`,
    UPDATE: (id: number | string) => `/users/${id}`,
    DELETE: (id: number | string) => `/users/${id}`,
    SEARCH: '/users/search',
  },
  CHAT: {
    MESSAGES: '/chat/messages',
    SEND_MESSAGE: '/chat/send',
    CONVERSATIONS: '/chat/conversations',
    UPDATE_MESSAGE: (id: string) => `/chat/messages/${id}`,
    DELETE_MESSAGE: (id: string) => `/chat/messages/${id}`,
  },
  MESSAGES: {
    CONVERSATION: (senderId: string, receiverId: string) => `/messages/conv/${senderId}/${receiverId}`,
    BY_ID: (id: number) => `/messages/${id}`,
    UPDATE: (id: number) => `/messages/${id}`,
    DELETE: (id: number) => `/messages/${id}`,
    SEND: '/messages/send',
  },
  GROUPS: {
    LIST: '/groups',
    CREATE: '/groups',
    BY_ID: (id: string) => `/groups/${id}`,
    UPDATE: (id: string) => `/groups/${id}`,
    DELETE: (id: string) => `/groups/${id}`,
    JOIN: '/groups/join',
    LEAVE: '/groups/leave',
    MEMBERS: (id: string) => `/groups/${id}/members`,
    MESSAGES: (id: string) => `/groups/${id}/messages`,
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    BY_ID: (id: string) => `/notifications/${id}`,
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/mark-all-read',
    DELETE: (id: string) => `/notifications/${id}`,
    SETTINGS: '/notifications/settings',
  },
  ADMIN: {
    USERS: '/admin/users',
    USER_BY_ID: (id: string) => `/admin/users/${id}`,
    UPDATE_USER: (id: string) => `/admin/users/${id}`,
    DELETE_USER: (id: string) => `/admin/users/${id}`,
    GROUPS: '/admin/groups',
    GROUP_BY_ID: (id: string) => `/admin/groups/${id}`,
    MESSAGES: '/admin/messages',
    MESSAGE_BY_ID: (id: string) => `/admin/messages/${id}`,
    ANALYTICS: '/admin/analytics',
    METRICS: '/admin/metrics',
  },
  SETTINGS: {
    GET: '/settings',
    UPDATE: '/settings',
    PRIVACY: '/settings/privacy',
    NOTIFICATIONS: '/settings/notifications',
    THEME: '/settings/theme',
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
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',
  JOIN_GROUP: 'group:join',
  LEAVE_GROUP: 'group:leave',
};
