
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  status: "active" | "blocked" | "suspended";
  joinDate: string;
  lastActive: string;
  messageCount: number;
  role: string;
}

export interface AdminGroup {
  id: string;
  name: string;
  members: number;
  created: string;
  status: "active" | "suspended";
}

export interface AdminMessage {
  id: string;
  user: string;
  content: string;
  timestamp: string;
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
