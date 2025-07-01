import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Search, Users, MessageSquare, BarChart3, TrendingUp, Server } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

import { AdminDashboard } from "./admin/components/AdminDashboard";
import { UserManagement } from "./admin/components/UserManagement";
import { GroupManagement } from "./admin/components/GroupManagement";
import { Analytics } from "./admin/components/Analytics";
import { SystemMetrics } from "./admin/components/SystemMetrics";
import { SystemControl } from "./admin/components/SystemControl";
import { toast } from "@/hooks/use-toast";

export const AdminPanel = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user } = useAuth();

  // Check if user is admin
  useEffect(() => {
    if (user && user.userRole !== 'ADMIN') {
      toast({
        title: "Unauthorized",
        description: "You are not authorized to access this page.",
        variant: "destructive",
      });
    }
  }, [user]);

  // Redirect if user is not admin
  if (!user || user.userRole !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  const handleTabChange = (value: string) => {
    console.log("Admin tab changed to:", value);
    setActiveTab(value);
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
    <div className="h-full flex flex-col bg-gradient-to-br from-background via-background to-secondary/20">
      <ScrollArea className="flex-1">
      <div className="flex-shrink-0 p-6 border-b border-border/50 space-y-6 bg-gradient-to-r from-background via-card/50 to-background backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              <Shield className="h-8 w-8 text-primary" />
              Admin Panel
            </h1>
            <p className="text-muted-foreground mt-1">Manage users, groups, and monitor system health</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users, groups, or content..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 cursor-text bg-background/80 border-border/50 focus:border-primary/50 transition-colors"
            />
          </div>
          <Select value={selectedFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-40 cursor-pointer bg-background/80 border-border/50 hover:border-primary/50 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border shadow-lg">
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="flagged">Flagged Only</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="suspended">Suspended Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-7 bg-muted/50 border border-border/30">
              <TabsTrigger value="dashboard" className="flex items-center gap-2 cursor-pointer hover:bg-accent transition-colors data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2 cursor-pointer hover:bg-accent transition-colors data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger value="groups" className="flex items-center gap-2 cursor-pointer hover:bg-accent transition-colors data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Groups</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2 cursor-pointer hover:bg-accent transition-colors data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2 cursor-pointer hover:bg-accent transition-colors data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Server className="h-4 w-4" />
                <span className="hidden sm:inline">System</span>
              </TabsTrigger>
              <TabsTrigger value="control" className="flex items-center gap-2 cursor-pointer hover:bg-accent transition-colors data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">System Control</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6 mt-6">
              <AdminDashboard />
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <UserManagement />
            </TabsContent>

            <TabsContent value="groups" className="mt-6">
              <GroupManagement />
            </TabsContent>


            <TabsContent value="analytics" className="space-y-6 mt-6">
              <Analytics />
            </TabsContent>

            <TabsContent value="system" className="mt-6">
              <SystemMetrics />
            </TabsContent>

            <TabsContent value="control" className="mt-6">
              <SystemControl />
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
};
