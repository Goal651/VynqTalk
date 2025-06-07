import { Message, User } from "@/types";

export interface AdminUser extends User {
  messageCount: number;
}

export interface AdminMessage extends Message {
  status: "approved" | "flagged" | "pending";
}

export interface SystemMetric {
  metric: string;
  value: string;
  status: "good" | "warning" | "error";
}

export interface Alert {
  id: number;
  type: "warning" | "info" | "error";
  message: string;
  time: string;
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
