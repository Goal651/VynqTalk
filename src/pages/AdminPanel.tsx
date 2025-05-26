import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Users, MessageSquare, Search, Ban, Trash2, Eye, BarChart3, Activity, Server, AlertTriangle, TrendingUp, UserCheck, MessageCircle, Clock } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useToast } from "@/hooks/use-toast";

export const AdminPanel = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();

  // Mock data for charts
  const userActivityData = [
    { date: "Jan 1", activeUsers: 120, newUsers: 15, messages: 450 },
    { date: "Jan 2", activeUsers: 135, newUsers: 22, messages: 520 },
    { date: "Jan 3", activeUsers: 142, newUsers: 18, messages: 480 },
    { date: "Jan 4", activeUsers: 158, newUsers: 25, messages: 680 },
    { date: "Jan 5", activeUsers: 165, newUsers: 30, messages: 720 },
    { date: "Jan 6", activeUsers: 178, newUsers: 28, messages: 850 },
    { date: "Jan 7", activeUsers: 185, newUsers: 35, messages: 920 },
  ];

  const contentModerationData = [
    { name: "Approved", value: 850, color: "#22c55e" },
    { name: "Flagged", value: 45, color: "#ef4444" },
    { name: "Pending", value: 120, color: "#f59e0b" },
    { name: "Deleted", value: 25, color: "#6b7280" },
  ];

  const systemMetrics = [
    { metric: "Server Uptime", value: "99.9%", status: "good" },
    { metric: "Response Time", value: "120ms", status: "good" },
    { metric: "Active Connections", value: "1,247", status: "normal" },
    { metric: "Storage Used", value: "68%", status: "warning" },
    { metric: "Memory Usage", value: "45%", status: "good" },
    { metric: "CPU Usage", value: "32%", status: "good" },
  ];

  const recentAlerts = [
    { id: 1, type: "warning", message: "High storage usage detected", time: "5 min ago" },
    { id: 2, type: "info", message: "New user registration spike", time: "15 min ago" },
    { id: 3, type: "error", message: "Failed login attempts from IP 192.168.1.100", time: "1 hour ago" },
  ];

  // Mock data for users, messages, and groups
  const mockUsers = [
    { id: "1", name: "Alice Johnson", email: "alice@example.com", status: "active", joinDate: "2024-01-15" },
    { id: "2", name: "Bob Smith", email: "bob@example.com", status: "suspended", joinDate: "2024-01-10" },
    { id: "3", name: "Charlie Brown", email: "charlie@example.com", status: "active", joinDate: "2024-01-20" },
  ];

  const mockMessages = [
    { id: "1", user: "Alice Johnson", content: "Hello everyone!", timestamp: "2024-01-25 10:30", status: "approved" },
    { id: "2", user: "Bob Smith", content: "This is suspicious content...", timestamp: "2024-01-25 11:00", status: "flagged" },
    { id: "3", user: "Charlie Brown", content: "Great conversation!", timestamp: "2024-01-25 11:15", status: "approved" },
  ];

  const mockGroups = [
    { id: "1", name: "General Chat", members: 150, created: "2024-01-01", status: "active" },
    { id: "2", name: "Dev Team", members: 25, created: "2024-01-05", status: "active" },
    { id: "3", name: "Random", members: 75, created: "2024-01-10", status: "suspended" },
  ];

  const handleTabChange = (value: string) => {
    console.log("Admin tab changed to:", value);
    setActiveTab(value);
  };

  const handleUserAction = (action: string, userId: string) => {
    console.log(`User action: ${action} for user ${userId}`);
    toast({
      title: "User Action",
      description: `Successfully performed ${action} action on user ${userId}`,
    });
  };

  const handleGroupAction = (action: string, groupId: string) => {
    console.log(`Group action: ${action} for group ${groupId}`);
    toast({
      title: "Group Action",
      description: `Successfully performed ${action} action on group ${groupId}`,
    });
  };

  const handleContentAction = (action: string, messageId: string) => {
    console.log(`Content action: ${action} for message ${messageId}`);
    toast({
      title: "Content Action",
      description: `Successfully performed ${action} action on message ${messageId}`,
    });
  };

  const handleQuickAction = (action: string) => {
    console.log("Quick action:", action);
    toast({
      title: "Quick Action",
      description: `${action} has been initiated`,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Search query changed:", e.target.value);
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (value: string) => {
    console.log("Filter changed:", value);
    setSelectedFilter(value);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 p-6 border-b space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Admin Panel
            </h1>
            <p className="text-muted-foreground">Manage users, groups, and monitor system health</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users, groups, or content..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-8 cursor-text"
            />
          </div>
          <Select value={selectedFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-40 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="flagged">Flagged Only</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="suspended">Suspended Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="dashboard" className="flex items-center gap-2 cursor-pointer hover:bg-accent transition-colors">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2 cursor-pointer hover:bg-accent transition-colors">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger value="groups" className="flex items-center gap-2 cursor-pointer hover:bg-accent transition-colors">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Groups</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2 cursor-pointer hover:bg-accent transition-colors">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Content</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2 cursor-pointer hover:bg-accent transition-colors">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2 cursor-pointer hover:bg-accent transition-colors">
                <Server className="h-4 w-4" />
                <span className="hidden sm:inline">System</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,247</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">43</div>
                    <p className="text-xs text-muted-foreground">+3 new this week</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Messages Today</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">920</div>
                    <p className="text-xs text-muted-foreground">+8% from yesterday</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
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
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Alerts</CardTitle>
                    <CardDescription>System notifications and warnings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentAlerts.map((alert) => (
                      <div 
                        key={alert.id} 
                        className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
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

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common administrative tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button type="button" 
                      className="w-full justify-start cursor-pointer hover:bg-accent transition-colors" 
                      variant="outline"
                      onClick={() => handleQuickAction("bulk-user-actions")}
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Bulk User Actions
                    </Button>
                    <Button type="button" 
                      className="w-full justify-start cursor-pointer hover:bg-accent transition-colors" 
                      variant="outline"
                      onClick={() => handleQuickAction("content-moderation")}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Content Moderation Queue
                    </Button>
                    <Button type="button" 
                      className="w-full justify-start cursor-pointer hover:bg-accent transition-colors" 
                      variant="outline"
                      onClick={() => handleQuickAction("system-maintenance")}
                    >
                      <Server className="h-4 w-4 mr-2" />
                      System Maintenance
                    </Button>
                    <Button type="button" 
                      className="w-full justify-start cursor-pointer hover:bg-accent transition-colors" 
                      variant="outline"
                      onClick={() => handleQuickAction("generate-reports")}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Generate Reports
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockUsers.map((user) => (
                        <TableRow key={user.id} className="cursor-pointer hover:bg-accent transition-colors">
                          <TableCell className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                              <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span>{user.name}</span>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.status === "active" ? "default" : "destructive"}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.joinDate}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button type="button" 
                                size="sm" 
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUserAction("view", user.id);
                                }}
                                className="cursor-pointer hover:bg-accent transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button type="button" 
                                size="sm" 
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUserAction("ban", user.id);
                                }}
                                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="groups" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Group Management</CardTitle>
                  <CardDescription>Manage chat groups and their settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Group Name</TableHead>
                        <TableHead>Members</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockGroups.map((group) => (
                        <TableRow key={group.id} className="cursor-pointer hover:bg-accent transition-colors">
                          <TableCell className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`https://api.dicebear.com/7.x/shapes/svg?seed=${group.name}`} />
                              <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span>{group.name}</span>
                          </TableCell>
                          <TableCell>{group.members}</TableCell>
                          <TableCell>{group.created}</TableCell>
                          <TableCell>
                            <Badge variant={group.status === "active" ? "default" : "destructive"}>
                              {group.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button type="button" 
                                size="sm" 
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleGroupAction("view", group.id);
                                }}
                                className="cursor-pointer hover:bg-accent transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button type="button" 
                                size="sm" 
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleGroupAction("suspend", group.id);
                                }}
                                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content Moderation</CardTitle>
                  <CardDescription>Review and moderate user-generated content</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockMessages.map((message) => (
                        <TableRow key={message.id} className="cursor-pointer hover:bg-accent transition-colors">
                          <TableCell>{message.user}</TableCell>
                          <TableCell className="max-w-xs truncate">{message.content}</TableCell>
                          <TableCell>{message.timestamp}</TableCell>
                          <TableCell>
                            <Badge variant={message.status === "approved" ? "default" : "destructive"}>
                              {message.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button type="button" 
                                size="sm" 
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleContentAction("view", message.id);
                                }}
                                className="cursor-pointer hover:bg-accent transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button type="button" 
                                size="sm" 
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleContentAction("delete", message.id);
                                }}
                                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>User Activity Trends</CardTitle>
                    <CardDescription>Daily active users and new registrations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        activeUsers: {
                          label: "Active Users",
                          color: "hsl(var(--chart-1))",
                        },
                        newUsers: {
                          label: "New Users",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={userActivityData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Area type="monotone" dataKey="activeUsers" stackId="1" stroke="var(--color-activeUsers)" fill="var(--color-activeUsers)" />
                          <Area type="monotone" dataKey="newUsers" stackId="1" stroke="var(--color-newUsers)" fill="var(--color-newUsers)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Content Moderation</CardTitle>
                    <CardDescription>Distribution of content status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        approved: { label: "Approved", color: "#22c55e" },
                        flagged: { label: "Flagged", color: "#ef4444" },
                        pending: { label: "Pending", color: "#f59e0b" },
                        deleted: { label: "Deleted", color: "#6b7280" },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={contentModerationData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {contentModerationData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Message Volume</CardTitle>
                    <CardDescription>Daily message activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        messages: {
                          label: "Messages",
                          color: "hsl(var(--chart-3))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={userActivityData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="messages" fill="var(--color-messages)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Growth Metrics</CardTitle>
                    <CardDescription>User growth over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        growth: {
                          label: "Total Users",
                          color: "hsl(var(--chart-4))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={userActivityData.map((item, index) => ({
                          ...item,
                          totalUsers: 1000 + (index * 47) + item.newUsers
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line type="monotone" dataKey="totalUsers" stroke="var(--color-growth)" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="system" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Metrics</CardTitle>
                  <CardDescription>Real-time system performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {systemMetrics.map((metric, index) => (
                      <Card 
                        key={index} 
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => console.log("System metric clicked:", metric.metric)}
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">{metric.metric}</p>
                              <p className="text-2xl font-bold">{metric.value}</p>
                            </div>
                            <div className={`h-3 w-3 rounded-full ${
                              metric.status === "good" ? "bg-green-500" :
                              metric.status === "warning" ? "bg-yellow-500" : "bg-red-500"
                            }`} />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
};
