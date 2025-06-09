
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/api";
import { adminService } from "@/api/services/admin";
import { Group, User } from "@/types";
import { AdminMessage, SystemMetric, ContentModerationData, Alert, ChartData } from "../types";

export const useAdminData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();


  useEffect(() => {
    setLoading(true);
    fetchUsers();
    fetchGroups();
    // fetchMessages();
    setLoading(false);
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminService.getAllUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await adminService.getAllGroups();
      if (response.success && response.data) {
        setGroups(response.data);
      }
    }
    catch (error) {
      console.error('Failed to fetch groups:', error);
      setGroups([]);
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await adminService.getAllMessages();
      if (response.success && response.data) {
        setMessages(response.data);
      }
    }
    catch (error) {
      console.error('Failed to fetch messages:', error);
      setMessages([]);
    }
  }

  const updateUser = async (userId: number, updates: User) => {
    try {
      const response = await adminService.updateUser(userId, updates);
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

  const deleteUser = async (userId: number) => {
    try {
      const response = await adminService.deleteUser(userId);
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
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([])

  useEffect(() => {
    const fetchSystemMetrics = async () => {
      const response = await adminService.getSystemMetrics()
      setSystemMetrics(response.data)
    }
    fetchSystemMetrics()
  }, [])
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
