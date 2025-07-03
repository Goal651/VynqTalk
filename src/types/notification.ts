/**
 * Represents a notification sent to a user.
 */
import type { User } from "./user";

export interface Notification {
  id: number;
  title: string;
  user: User;
  details: string;
  timestamp: string;
  isRead: boolean;
  type: "INFO" | "WARNING" | "ERROR" | "SUCCESS";
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  messageNotifications: boolean;
  groupNotifications: boolean;
  mentionNotifications: boolean;
} 