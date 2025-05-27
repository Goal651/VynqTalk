
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageCircle, MessageSquare, Activity, AlertTriangle, UserCheck, Server, BarChart3 } from "lucide-react";
import { useAdminMetrics } from "../hooks/useAdminData";
import { useToast } from "@/hooks/use-toast";

export const AdminDashboard = () => {
  const { recentAlerts } = useAdminMetrics();
  const { toast } = useToast();

  const handleQuickAction = (action: string) => {
    console.log("Quick action:", action);
    toast({
      title: "Quick Action",
      description: `${action} has been initiated`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-card to-card/50 border-border/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-card to-card/50 border-border/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">43</div>
            <p className="text-xs text-muted-foreground">+3 new this week</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-card to-card/50 border-border/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Today</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">920</div>
            <p className="text-xs text-muted-foreground">+8% from yesterday</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-card to-card/50 border-border/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">99.9%</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/30">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>System notifications and warnings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className="flex items-center gap-3 p-3 border border-border/30 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => console.log("Alert clicked:", alert.id)}
              >
                <AlertTriangle className={`h-4 w-4 ${
                  alert.type === "error" ? "text-red-500" : 
                  alert.type === "warning" ? "text-yellow-500" : "text-blue-500"
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 border-border/30">
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
        </Card>
      </div>
    </div>
  );
};
