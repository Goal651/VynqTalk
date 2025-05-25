import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import { Bell, MessageCircle, Users, UserPlus, Settings, Trash2, Check } from "lucide-react";

interface Notification {
  id: string;
  type: "message" | "group_invite" | "mention" | "system";
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  avatar?: string;
  actionUrl?: string;
}

export const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "n1",
      type: "message",
      title: "New message from Alice",
      description: "Hey! Are you available for a quick chat?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      read: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice"
    },
    {
      id: "n2", 
      type: "group_invite",
      title: "Group invitation",
      description: "Bob invited you to join 'Project Alpha' group",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob"
    },
    {
      id: "n3",
      type: "mention",
      title: "You were mentioned",
      description: "Charlie mentioned you in 'Team Chat'",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: true,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=charlie"
    },
    {
      id: "n4",
      type: "system",
      title: "Account security",
      description: "New login from a different device detected",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      read: true,
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
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
    if (filter === "unread") return notifications.filter(n => !n.read);
    return notifications.filter(n => n.type === filter);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount}</Badge>
            )}
          </h1>
          <p className="text-muted-foreground">Stay updated with your latest activity</p>
        </div>
        {unreadCount > 0 && (
          <Button type="button" onClick={markAllAsRead} variant="outline">
            Mark all as read
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">
            Unread {unreadCount > 0 && <Badge className="ml-1">{unreadCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="message">Messages</TabsTrigger>
          <TabsTrigger value="group_invite">Groups</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {["all", "unread", "message", "group_invite", "system"].map((filter) => (
          <TabsContent key={filter} value={filter} className="space-y-4">
            {filterNotifications(filter).length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No notifications found</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filterNotifications(filter).map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-all hover:shadow-md ${
                    !notification.read ? "ring-2 ring-primary/20 bg-primary/5" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        {notification.avatar ? (
                          <Avatar>
                            <AvatarImage src={notification.avatar} />
                            <AvatarFallback>
                              {notification.title.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                        )}
                        {!notification.read && (
                          <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full" />
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-medium ${!notification.read ? "font-semibold" : ""}`}>
                            {notification.title}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.description}
                        </p>
                        
                        <div className="flex items-center space-x-2 pt-2">
                          {!notification.read && (
                            <Button type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Mark as read
                            </Button>
                          )}
                          <Button type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
