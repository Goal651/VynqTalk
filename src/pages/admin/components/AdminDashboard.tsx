import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageCircle, MessageSquare, Activity, AlertTriangle, } from "lucide-react";
import { useDashboardStats, useRecentAlerts } from "../hooks/useAdminData";
import { useToast ,useIsMobile} from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";

export const AdminDashboard = () => {
  const { stats, loading, error } = useDashboardStats();
  const { alerts, loading: alertsLoading, error: alertsError } = useRecentAlerts();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleQuickAction = (action: string) => {
    console.log("Quick action:", action);
    toast({
      title: "Quick Action",
      description: `${action} has been initiated`,
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className={isMobile ? "flex flex-col gap-3" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-gradient-to-br from-card to-card/50 border-border/30 animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-2 rounded" />
                <Skeleton className="h-4 w-32 rounded" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-card to-card/50 border-border/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalUsers ?? "—"}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.newUsersThisMonth !== undefined ? `${stats.newUsersThisMonth} new this month` : ""}
                </p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-card to-card/50 border-border/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalGroups ?? "—"}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.newGroupsThisWeek !== undefined ? `${stats.newGroupsThisWeek} new this week` : ""}
                </p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-card to-card/50 border-border/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages Today</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.messagesToday ?? "—"}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.percentChange !== undefined ? `${stats.percentChange > 0 ? "+" : ""}${stats.percentChange}% from yesterday` : ""}
                </p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-card to-card/50 border-border/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages Yesterday</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.messagesYesterday ?? "—"}</div>
                <p className="text-xs text-muted-foreground">Yesterday's total</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {error && <div className="text-red-500">Error loading dashboard stats: {error}</div>}

      <div className={isMobile ? "flex flex-col gap-3" : "grid grid-cols-1 lg:grid-cols-2 gap-6"}>
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/30">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>System notifications and warnings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alertsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 border border-border/30 rounded-lg animate-pulse">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-2 rounded" />
                    <Skeleton className="h-3 w-40 rounded" />
                  </div>
                </div>
              ))
            ) : alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mb-2" />
                <span>No alerts found</span>
              </div>
            ) : (
              <>
                {alertsError && <div className="text-red-500">{alertsError}</div>}
                {alerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className="flex items-center gap-3 p-3 border border-border/30 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => console.log("Alert clicked:", alert.id)}
                  >
                    <AlertTriangle className={`h-4 w-4 ${
                      alert.level === "critical" ? "text-red-500" : 
                      alert.level === "warning" ? "text-yellow-500" : "text-blue-500"
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{new Date(alert.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </CardContent>
        </Card>

        {/* <Card className="bg-gradient-to-br from-card to-card/50 border-border/30">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button type="button" 
              className="w-full justify-start cursor-pointer hover:bg-accent/50 transition-colors" 
              variant="outline"
              onClick={() => handleQuickAction("bulk-user-actions")}
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Bulk User Actions
            </Button>
            <Button type="button" 
              className="w-full justify-start cursor-pointer hover:bg-accent/50 transition-colors" 
              variant="outline"
              onClick={() => handleQuickAction("content-moderation")}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Content Moderation Queue
            </Button>
            <Button type="button" 
              className="w-full justify-start cursor-pointer hover:bg-accent/50 transition-colors" 
              variant="outline"
              onClick={() => handleQuickAction("system-maintenance")}
            >
              <Server className="h-4 w-4 mr-2" />
              System Maintenance
            </Button>
            <Button type="button" 
              className="w-full justify-start cursor-pointer hover:bg-accent/50 transition-colors" 
              variant="outline"
              onClick={() => handleQuickAction("generate-reports")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Reports
            </Button>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};
