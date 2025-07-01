import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { Bell, MessageCircle, Users, UserPlus, Settings, Trash2, Check, Filter, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { notificationService } from "@/api/services/notifications";
import { Notification } from "@/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

export const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const { toast } = useToast();
  const { user } = useAuth();
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await notificationService.getAllNotifications(user?.id || 0);
      console.log("Notification response", response);
      if (response.success && response.data) {
        setNotifications(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      toast({
        title: "Success",
        description: "Notification marked as read",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(user?.id || 0 );
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      });
    }
  };

    const deleteNotification = async (id: number) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast({
        title: "Success",
        description: "Notification deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageCircle className="h-4 w-4" />;
      case "group_invite":
        return <Users className="h-4 w-4" />;
      case "mention":
        return <UserPlus className="h-4 w-4" />;
      case "system":
        return <Settings className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "message":
        return "bg-blue-500";
      case "group_invite":
        return "bg-green-500";
      case "mention":
        return "bg-orange-500";
      case "system":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const filterNotifications = (filter: string) => {
    if (filter === "all") return notifications;
    if (filter === "unread") return notifications.filter(n => !n.isRead);
    return notifications.filter(n => n.type === filter);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background to-secondary/5">
      <div className="flex-shrink-0 text-center p-6 border-b space-y-6 bg-background/50 backdrop-blur-sm">
        <div className="flex justify-between items-center  w-full">
          <div className="flex flex-col gap-y-6 w-full "> 
            <h1 className="text-2xl font-bold flex justify-center items-center gap-2">
              <Bell className="h-6 w-6" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  {unreadCount}
                </Badge>
              )}
            </h1>
          </div>
          {unreadCount > 0 && (
            <Button 
              type="button" 
              onClick={markAllAsRead} 
              variant="outline"
              className="hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Check className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveFilter}>
          <TabsList className="bg-background/50 backdrop-blur-sm">
            <TabsTrigger value="all" className="relative">
              All
              {notifications.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {notifications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread" className="relative">
              Unread
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="message">Messages</TabsTrigger>
            <TabsTrigger value="group_invite">Groups</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {filterNotifications(activeFilter).length === 0 ? (
                  <Card className="bg-background/50 backdrop-blur-sm">
                    <CardContent className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mx-auto mb-4 flex items-center justify-center">
                          <Bell className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">No notifications found</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  filterNotifications(activeFilter).map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        className={cn(
                          "transition-all hover:shadow-md bg-background/50 backdrop-blur-sm",
                          !notification.isRead && "ring-2 ring-primary/20 bg-primary/5"
                        )}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-4">
                            <div className="relative">
                              {notification.user.avatar ? (
                                <Avatar className="ring-2 ring-primary/10">
                                  <AvatarImage src={notification.user.avatar} />
                                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20">
                                    {notification.title.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              ) : (
                                <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                                  {getNotificationIcon(notification.type)}
                                </div>
                              )}
                              {!notification.isRead && (
                                <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-pulse" />
                              )}
                            </div>
                            
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <h3 className={cn(
                                  "font-medium",
                                  !notification.isRead && "font-semibold"
                                )}>
                                  {notification.title}
                                </h3>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center space-x-2 pt-2">
                                {!notification.isRead && (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => markAsRead(notification.id)}
                                    className="hover:bg-primary hover:text-primary-foreground transition-colors"
                                  >
                                    <Check className="h-3 w-3 mr-1" />
                                    Mark as read
                                  </Button>
                                )}
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteNotification(notification.id)}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
