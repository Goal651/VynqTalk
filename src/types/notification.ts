/**
 * Represents a notification sent to a user.
 */
import type { User } from "./user";

export interface Notification {
  id: number;
  title: string;
  user: User;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: "info" | "warning" | "error" | "success";
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  messageNotifications: boolean;
  groupNotifications: boolean;
  mentionNotifications: boolean;
} 