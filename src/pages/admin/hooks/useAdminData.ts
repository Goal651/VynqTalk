
import { useState, useEffect } from "react";
import { AdminUser, AdminGroup, AdminMessage, SystemMetric, Alert, ChartData, ContentModerationData } from "../types";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/api";

export const useAdminData = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [groups, setGroups] = useState<AdminGroup[]>([]);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Mock data - replace with actual API calls
  const mockUsers: AdminUser[] = [
    { id: "1", name: "Alice Johnson", email: "alice@example.com", status: "active", joinDate: "2024-01-15", lastActive: "2 min ago", messageCount: 245, role: "user" },
    { id: "2", name: "Bob Smith", email: "bob@example.com", status: "blocked", joinDate: "2024-01-10", lastActive: "1 hour ago", messageCount: 89, role: "user" },
    { id: "3", name: "Charlie Brown", email: "charlie@example.com", status: "active", joinDate: "2024-01-20", lastActive: "5 min ago", messageCount: 156, role: "user" },
    { id: "4", name: "Diana Wilson", email: "diana@example.com", status: "suspended", joinDate: "2024-01-18", lastActive: "1 day ago", messageCount: 67, role: "user" },
    { id: "5", name: "Eve Davis", email: "eve@example.com", status: "active", joinDate: "2024-01-22", lastActive: "Just now", messageCount: 334, role: "user" },
  ];

  const mockGroups: AdminGroup[] = [
    { id: "1", name: "General Chat", members: 150, created: "2024-01-01", status: "active" },
    { id: "2", name: "Dev Team", members: 25, created: "2024-01-05", status: "active" },
    { id: "3", name: "Random", members: 75, created: "2024-01-10", status: "suspended" },
  ];

  const mockMessages: AdminMessage[] = [
    { id: "1", user: "Alice Johnson", content: "Hello everyone!", timestamp: "2024-01-25 10:30", status: "approved" },
    { id: "2", user: "Bob Smith", content: "This is suspicious content...", timestamp: "2024-01-25 11:00", status: "flagged" },
    { id: "3", user: "Charlie Brown", content: "Great conversation!", timestamp: "2024-01-25 11:15", status: "approved" },
  ];

  useEffect(() => {
    setUsers(mockUsers);
    setGroups(mockGroups);
    setMessages(mockMessages);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<AdminUser[]>('/admin/users');
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: string, updates: Partial<AdminUser>) => {
    try {
      const response = await apiClient.put(`/admin/users/${userId}`, updates);
      if (response.success) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, ...updates } : user
        ));
        toast({
          title: "User Updated",
          description: "User has been updated successfully",
        });
        return true;
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      // Fallback to local update for demo
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, ...updates } : user
      ));
      toast({
        title: "User Updated",
        description: "User has been updated successfully",
      });
      return true;
    }
    return false;
  };

  const deleteUser = async (userId: string) => {
    try {
      const response = await apiClient.delete(`/admin/users/${userId}`);
      if (response.success) {
        setUsers(prev => prev.filter(user => user.id !== userId));
        toast({
          title: "User Deleted",
          description: "User has been deleted successfully",
        });
        return true;
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      // Fallback to local delete for demo
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast({
        title: "User Deleted",
        description: "User has been deleted successfully",
      });
      return true;
    }
    return false;
  };

  return {
    users,
    groups,
    messages,
    loading,
    fetchUsers,
    updateUser,
    deleteUser,
    setUsers,
  };
};

export const useAdminMetrics = () => {
  const userActivityData: ChartData[] = [
    { date: "Jan 1", activeUsers: 120, newUsers: 15, messages: 450 },
    { date: "Jan 2", activeUsers: 135, newUsers: 22, messages: 520 },
    { date: "Jan 3", activeUsers: 142, newUsers: 18, messages: 480 },
    { date: "Jan 4", activeUsers: 158, newUsers: 25, messages: 680 },
    { date: "Jan 5", activeUsers: 165, newUsers: 30, messages: 720 },
    { date: "Jan 6", activeUsers: 178, newUsers: 28, messages: 850 },
    { date: "Jan 7", activeUsers: 185, newUsers: 35, messages: 920 },
  ];

  const contentModerationData: ContentModerationData[] = [
    { name: "Approved", value: 850, color: "#22c55e" },
    { name: "Flagged", value: 45, color: "#ef4444" },
    { name: "Pending", value: 120, color: "#f59e0b" },
    { name: "Deleted", value: 25, color: "#6b7280" },
  ];

  const systemMetrics: SystemMetric[] = [
    { metric: "Server Uptime", value: "99.9%", status: "good" },
    { metric: "Response Time", value: "120ms", status: "good" },
    { metric: "Active Connections", value: "1,247", status: "good" },
    { metric: "Storage Used", value: "68%", status: "warning" },
    { metric: "Memory Usage", value: "45%", status: "good" },
    { metric: "CPU Usage", value: "32%", status: "good" },
  ];

  const recentAlerts: Alert[] = [
    { id: 1, type: "warning", message: "High storage usage detected", time: "5 min ago" },
    { id: 2, type: "info", message: "New user registration spike", time: "15 min ago" },
    { id: 3, type: "error", message: "Failed login attempts from IP 192.168.1.100", time: "1 hour ago" },
  ];

  return {
    userActivityData,
    contentModerationData,
    systemMetrics,
    recentAlerts,
  };
};
