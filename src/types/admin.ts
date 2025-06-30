/**
 * Admin panel types.
 */
import type { User } from './user';

export interface AdminUser extends User {
  messageCount: number;
}

export interface SystemMetric {
  name: string;
  value: number;
  timestamp: string;
}

export interface Alert {
  id: number;
  message: string;
  level: 'info' | 'warning' | 'critical';
  timestamp: string;
}

export interface ChartData {
  date: string;
  activeUsers: number;
  newUsers: number;
  messages: number;
}

export interface ContentModerationData {
  name: string;
  value: number;
  color: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalGroups: number;
  totalMessages: number;
  flaggedContent: number;
  newUsersThisMonth: number;
  newGroupsThisWeek: number;
  messagesToday: number;
  messagesYesterday: number;
  percentChange: number;
}

export interface AdminMessage {
  id: number;
  content: string;
  senderId: number;
  timestamp: string;
  status: 'approved' | 'flagged' | 'pending';
} 