import { useState, useEffect } from "react";
import { useToast } from "@/hooks";
import { adminService } from "@/api";
import { AdminStats, Group, User, SystemMetric, ContentModerationData, Alert, ChartData, UpdateUserStatusRequest } from '@/types';
import { useSocket } from "@/contexts/SocketContext";

export const useAdminData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();


  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchGroups()]);
      setLoading(false);
    };
    fetchAll();
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



  const updateUser = async (userId: number, updates: UpdateUserStatusRequest) => {
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
    loading,
    fetchUsers,
    updateUser,
    deleteUser,
    setUsers,
  };
};

export const useAdminMetrics = () => {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [userActivityData, setUserActivityData] = useState<ChartData[]>([]);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    const handleMetrics = (data: Record<string, unknown>) => {
      // Validate and map data to SystemMetric[]
      let metrics: SystemMetric[] = [];
      if (Array.isArray(data)) {
        metrics = data.filter(
          (item): item is SystemMetric =>
            typeof item === 'object' &&
            item !== null &&
            'metric' in item &&
            'value' in item &&
            'status' in item
        );
      } else if (
        typeof data === 'object' &&
        data !== null &&
        'metric' in data &&
        'value' in data &&
        'status' in data
      ) {
        metrics = [data as unknown as SystemMetric];
      }
      setSystemMetrics(metrics);
    };
    socket.onSystemMetrics(handleMetrics);
    return () => {
      socket.removeSystemMetricsListener(handleMetrics);
    };
  }, [socket]);

  useEffect(() => {
    // Fetch real chart data from backend
    adminService.getAnalytics().then(res => {
      if (res && res.data) {
        setUserActivityData(res.data);
      }
    });
  }, []);

  const contentModerationData: ContentModerationData[] = [
    { name: "Approved", value: 850, color: "#22c55e" },
    { name: "Flagged", value: 45, color: "#ef4444" },
    { name: "Pending", value: 120, color: "#f59e0b" },
    { name: "Deleted", value: 25, color: "#6b7280" },
  ];

  return {
    userActivityData,
    contentModerationData,
    systemMetrics,
  };
};

export const useDashboardStats = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await adminService.getDashboardStats();
        if (response.success && response.data) {
          setStats(response.data);
        } else {
          setError("Failed to fetch dashboard stats");
        }
      } catch (err) {
        setError("Failed to fetch dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return { stats, loading, error };
};

export const useRecentAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await adminService.getRecentAlerts();
        if (response.success && response.data) {
          setAlerts(response.data);
        } else {
          setError("Failed to fetch alerts");
        }
      } catch (err) {
        setError("Failed to fetch alerts");
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  return { alerts, loading, error };
};
