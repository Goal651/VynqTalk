import { useState, useEffect } from "react"
import { Card, CardContent} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { Bell, MessageCircle, Users, UserPlus, Settings, Trash2, Check,} from "lucide-react"
import { useToast } from "@/hooks"
import { notificationService } from "@/api"
import { Notification } from "@/types"
import { cn } from "@/lib"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { Skeleton } from "@/components/ui/skeleton";

export const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("all")
  const { toast } = useToast()
  const { user } = useAuth()
  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setIsLoading(true)
      const response = await notificationService.getAllNotifications(user?.id || 0)
      console.log("Notification response", response)
      if (response.success && response.data) {
        setNotifications(response.data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  const markAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id)
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      )
      toast({
        title: "Success",
        description: "Notification marked as read",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      })
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(user?.id || 0 )
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      toast({
        title: "Success",
        description: "All notifications marked as read",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      })
    }
  }

    const deleteNotification = async (id: number) => {
    try {
      await notificationService.deleteNotification(id)
      setNotifications(prev => prev.filter(n => n.id !== id))
      toast({
        title: "Success",
        description: "Notification deleted",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      })
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageCircle className="h-4 w-4" />
      case "group_invite":
        return <Users className="h-4 w-4" />
      case "mention":
        return <UserPlus className="h-4 w-4" />
      case "system":
        return <Settings className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "message":
        return "bg-blue-500"
      case "group_invite":
        return "bg-green-500"
      case "mention":
        return "bg-orange-500"
      case "system":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const filterNotifications = (filter: string) => {
    if (filter === "all") return notifications
    if (filter === "unread") return notifications.filter(n => !n.isRead)
    return notifications.filter(n => n.type === filter)
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-shrink-0 text-center p-3 sm:p-6 border-b border-border space-y-4 sm:space-y-6 bg-background">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 w-full">
          <h1 className="text-xl sm:text-2xl font-bold flex justify-center items-center gap-2">
            <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                {unreadCount}
              </Badge>
            )}
          </h1>
          {unreadCount > 0 && (
            <Button 
              type="button" 
              onClick={markAllAsRead} 
              variant="outline"
              className="hover:bg-primary hover:text-primary-foreground transition-colors w-full sm:w-auto mt-2 sm:mt-0"
            >
              <Check className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveFilter}>
          <TabsList className="bg-muted flex flex-wrap p-1 h-auto min-h-[44px] gap-1">
            <TabsTrigger value="all" className="relative text-xs sm:text-base px-3 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground">
              All
              {notifications.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {notifications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread" className="relative text-xs sm:text-base px-3 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground">
              Unread
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="message" className="text-xs sm:text-base px-3 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground">Messages</TabsTrigger>
            <TabsTrigger value="group_invite" className="text-xs sm:text-base px-3 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground">Groups</TabsTrigger>
            <TabsTrigger value="system" className="text-xs sm:text-base px-3 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground">System</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 sm:p-6 max-w-4xl mx-auto">
          {isLoading ? (
            <div className="space-y-3 sm:space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="bg-card border-border">
                  <CardContent className="flex items-center gap-4 py-6">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32 rounded" />
                      <Skeleton className="h-3 w-48 rounded" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-3 sm:space-y-4"
              >
                {filterNotifications(activeFilter).length === 0 ? (
                  <Card className="bg-card border-border">
                    <CardContent className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
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
                          "transition-all hover:shadow-md bg-card border-border",
                          !notification.isRead && "ring-2 ring-primary/20 bg-primary/5"
                        )}
                      >
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex items-start space-x-3 sm:space-x-4">
                            <div className="relative">
                              {notification.user.avatar ? (
                                <Avatar className="ring-2 ring-primary/10">
                                  <AvatarImage src={notification.user.avatar} />
                                  <AvatarFallback className="bg-muted">
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
                                  "font-medium text-sm sm:text-base truncate",
                                  !notification.isRead && "font-semibold"
                                )}>
                                  {notification.title}
                                </h3>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center space-x-1 sm:space-x-2 pt-2">
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
  )
}
