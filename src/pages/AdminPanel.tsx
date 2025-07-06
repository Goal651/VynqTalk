import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Search, Users, MessageSquare, BarChart3, TrendingUp, Server } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

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
  const isMobile = useIsMobile();
  const [showNavOnly, setShowNavOnly] = useState(true);

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
    if (isMobile) setShowNavOnly(false);
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
        <div className="flex-shrink-0 p-3 sm:p-6 border-b border-border/50 space-y-4 sm:space-y-6 bg-gradient-to-r from-background via-card/50 to-background backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
              Admin Panel
            </h1>
            <p className="text-xs sm:text-base text-muted-foreground mt-1">Manage users, groups, and monitor system health</p>
          </div>

          
        </div>

        <div className="p-0 sm:p-6 space-y-0 sm:space-y-6 max-w-7xl mx-auto w-full">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            {/* Mobile: Show only nav if showNavOnly, else show only content full width */}
            {isMobile ? (
              showNavOnly ? (
                <TabsList className="flex flex-col w-full h-[calc(100vh-120px)] overflow-y-auto bg-transparent border border-border/20 shadow-xl rounded-2xl mx-2 my-4 p-1 text-sm">
                  <TabsTrigger value="dashboard" className="w-full flex items-center gap-3 cursor-pointer hover:bg-accent/70 transition-colors data-[state=active]:bg-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:scale-[1.03] justify-start px-5 py-3 text-base rounded-xl mb-2 border-b border-border/10 last:mb-0 last:border-b-0">
                    <BarChart3 className="h-3 w-3" />
                    <span>Dashboard</span>
                  </TabsTrigger>
                  <TabsTrigger value="users" className="w-full flex items-center gap-3 cursor-pointer hover:bg-accent/70 transition-colors data-[state=active]:bg-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:scale-[1.03] justify-start px-5 py-3 text-base rounded-xl mb-2 border-b border-border/10 last:mb-0 last:border-b-0">
                    <Users className="h-3 w-3" />
                    <span>Users</span>
                  </TabsTrigger>
                  <TabsTrigger value="groups" className="w-full flex items-center gap-3 cursor-pointer hover:bg-accent/70 transition-colors data-[state=active]:bg-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:scale-[1.03] justify-start px-5 py-3 text-base rounded-xl mb-2 border-b border-border/10 last:mb-0 last:border-b-0">
                    <Users className="h-3 w-3" />
                    <span>Groups</span>
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="w-full flex items-center gap-3 cursor-pointer hover:bg-accent/70 transition-colors data-[state=active]:bg-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:scale-[1.03] justify-start px-5 py-3 text-base rounded-xl mb-2 border-b border-border/10 last:mb-0 last:border-b-0">
                    <TrendingUp className="h-3 w-3" />
                    <span>Analytics</span>
                  </TabsTrigger>
                  <TabsTrigger value="system" className="w-full flex items-center gap-3 cursor-pointer hover:bg-accent/70 transition-colors data-[state=active]:bg-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:scale-[1.03] justify-start px-5 py-3 text-base rounded-xl mb-2 border-b border-border/10 last:mb-0 last:border-b-0">
                    <Server className="h-3 w-3" />
                    <span>System</span>
                  </TabsTrigger>
                  <TabsTrigger value="control" className="w-full flex items-center gap-3 cursor-pointer hover:bg-accent/70 transition-colors data-[state=active]:bg-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:scale-[1.03] justify-start px-5 py-3 text-base rounded-xl mb-2 border-b border-border/10 last:mb-0 last:border-b-0">
                    <Shield className="h-3 w-3" />
                    <span>Control</span>
                  </TabsTrigger>
                </TabsList>
              ) : (
                <div className="w-full h-[calc(100vh-180px)] flex flex-col bg-background p-0 m-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-fit mb-2 ml-2 mt-2"
                    onClick={() => setShowNavOnly(true)}
                  >
                    ← Back
                  </Button>
                  {activeTab === "dashboard" && <div className="flex-1 flex flex-col w-full h-full"><AdminDashboard /></div>}
                  {activeTab === "users" && <div className="flex-1 flex flex-col w-full h-full"><UserManagement /></div>}
                  {activeTab === "groups" && <div className="flex-1 flex flex-col w-full h-full"><GroupManagement /></div>}
                  {activeTab === "analytics" && <div className="flex-1 flex flex-col w-full h-full"><Analytics /></div>}
                  {activeTab === "system" && <div className="flex-1 flex flex-col w-full h-full"><SystemMetrics /></div>}
                  {activeTab === "control" && <div className="flex-1 flex flex-col w-full h-full"><SystemControl /></div>}
                </div>
              )
            ) : (
              <>
                <TabsList className="grid w-full grid-cols-3 sm:grid-cols-7 bg-muted/50 border border-border/30 text-xs sm:text-base">
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
              </>
            )}
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
};
