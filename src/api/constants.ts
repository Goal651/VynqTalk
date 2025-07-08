// API Configuration Constants

const SERVER_URL = 'https://vynqtalk-server-production.up.railway.app'

export const API_CONFIG = {
  BASE_URL: import.meta.env.MODE === 'development' ? 'http://localhost:8080' : SERVER_URL,
  API_VERSION: 'v2',
  TIMEOUT: 10000,
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_USER: '/auth/check-user',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USER: {
    ALL: '/user/all',
    PROFILE: (fileName: string) => `/profile/${fileName}`,
    UPDATE_PROFILE: (id: number) => `/user/profile/${id}`,
    GET_DATA: '/user',
    UPLOAD_AVATAR: '/upload/user',
    BY_ID: (id: number | string) => `/user/${id}`,
    UPDATE: '/user',
    EXPORT: '/user/export',
    DELETE: '/user'
  },

  CHAT: {
    MESSAGES: '/chat/messages',
    SEND_MESSAGE: '/chat/send',
    CONVERSATIONS: '/chat/conversations',
    UPDATE_MESSAGE: (id: string) => `/chat/messages/${id}`,
    DELETE_MESSAGE: (id: string) => `/chat/messages/${id}`,
  },
  MESSAGES: {
    CONVERSATION: (senderId: string, receiverId: string) => `/messages/all/${senderId}/${receiverId}`,
    BY_ID: (id: number) => `/messages/${id}`,
    UPDATE: (id: number) => `/messages/${id}`,
    DELETE: (id: number) => `/messages/${id}`,
    UPLOAD: '/upload/message',
  },
  GROUP: {
    LIST: '/group/all',
    CREATE: '/group',
    UPLOAD_AVATAR: (id: number) => `/upload/group/${id}`,
    BY_ID: (id: number) => `/group/${id}`,
    UPDATE: (id: number) => `/group/${id}`,
    DELETE: (id: number) => `/group/${id}`,
    JOIN: '/group/join',
    LEAVE: '/group/leave',
  },
  GROUP_MEMBERS: {
    GET_MEMBERS: (groupId: number) => `/member/${groupId}`,
    ADD_MEMBER: (groupId: number,userId:number) => `/member/${groupId}/${userId}`,
    REMOVE_MEMBER: (groupId: number,userId:number) => `/member/${groupId}/${userId}`
  },
  GROUP_MESSAGES: {
    ALL: (groupId: number) => `/group_messages/conv/${groupId}`,
    BY_ID: (id: number) => `/group_messages/${id}`,
    UPDATE: (id: number) => `/group_messages/${id}`,
    DELETE: (id: number) => `/group_messages/${id}`,
    REACT: (id: number) => `/group_messages/${id}/react`,
    REMOVE_REACTION: (id: number) => `/group_messages/${id}/reactions`,
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    BY_ID: (id: number) => `/notifications/${id}`,
    MARK_READ: (id: number) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/mark-all-read',
    DELETE: (id: number) => `/notifications/${id}`,
    SETTINGS: (userId: number) => `/notifications/user/${userId}/settings`,
    DEVICE_REGISTER: '/notifications/device/register',
    DEVICE_UNREGISTER: '/notifications/device/register',
  },
  ADMIN: {
    USERS: '/admin/users',
    USER_BY_ID: (id: number) => `/admin/users/${id}`,
    UPDATE_USER: (id: number) => `/admin/users/${id}`,
    DELETE_USER: (id: number) => `/admin/users/${id}`,
    GROUPS: '/admin/groups',
    GROUP_BY_ID: (id: number) => `/admin/groups/${id}`,
    MESSAGES: '/admin/messages',
    MESSAGE_BY_ID: (id: number) => `/admin/messages/${id}`,
    ANALYTICS: '/admin/analytics',
    METRICS: '/admin/metrics',
    DASHBOARD_STATS: '/admin/dashboard-stats',
    RECENT_ALERTS: '/admin/alerts/recent',
  },
  SYSTEM: {
    STATUS: '/system/status',
  },
  SETTINGS: {
    GET: '/user/settings',
    UPDATE: '/user/settings',
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
};

export const SOCKET_EVENTS = {
  MESSAGE: {
    SEND_MESSAGE: '/app/chat.sendMessage',
    REPLY_MESSAGE: '/app/chat.sendMessageReply',
    REACT_MESSAGE: '/app/chat.sendMessageReaction',
  },
  GROUP_MESSAGE: {
    SEND_MESSAGE: '/app/group.sendMessage',
    REPLY_MESSAGE: '/app/group.sendMessageReply',
    REACT_MESSAGE: '/app/group.sendMessageReaction',
  }
};
