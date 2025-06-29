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
  status: string;
}


export interface Alert {
  id: number;
  type: "info" | "warning" | "error";
  message: string;
  createdAt: string;
  ipAddress: string;
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
