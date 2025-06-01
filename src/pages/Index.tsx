
import { useEffect, useState } from "react"
import { Navbar } from "../components/Navbar"
import { ChatView } from "../components/ChatView"
import { Groups } from "./Groups"
import { Settings } from "./Settings"
import { Notifications } from "./Notifications"
import { AdminPanel } from "./AdminPanel"
import { ThemeProvider } from "../contexts/ThemeContext"
import { useToast } from "@/hooks/use-toast"
import { Message, User } from "@/types"
import { useAuth } from "@/contexts/AuthContext"
import { userService } from "@/api/services/users"
import { messageService } from "@/api/services/messages"


const Index = () => {
  const [currentView, setCurrentView] = useState<"chat" | "group" | "settings" | "notifications" | "admin">("chat")
  const { toast } = useToast()
  const { user, logout } = useAuth()
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getAllUsers()
        console.log("Users:", response)
        if (response && response.data) setUsers(response.data)
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching users:', error.message)
          toast({
            title: "Error",
            description: "There was an error fetching users.",
            variant: "destructive",
          })
        }
      }
    }
    fetchUsers()
  }, [])

  const handleMessageDeleted = async (messageId: number) => {
    try {
      await messageService.deleteMessage(messageId)
      toast({
        title: "Message deleted",
        description: "Your message has been deleted successfully.",
      })
    } catch (error) {
      console.error('Error deleting message:', error)
      toast({
        title: "Error",
        description: "There was an error deleting your message.",
        variant: "destructive",
      })
    }
  }

  const handleMessageEdit = async(message: Message) => {
    try {
      await messageService.updateMessage(message.id, message.content)
      toast({
        title: "Message updated",
        description: "Your message has been updated successfully.",
      })
    } catch (error) {
      console.error('Error updating message:', error)
      toast({
        title: "Error",
        description: "There was an error updating your message.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    logout()
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "chat":
        return (
          <ChatView
            onMessageDelete={handleMessageDeleted}
            onMessageEdit={handleMessageEdit}
            users={users}
          />
        )
      case "group":
        return <Groups />
      case "settings":
        return <Settings />
      case "notifications":
        return <Notifications />
      case "admin":
        return <AdminPanel />
      default:
        return (
          <ChatView
            onMessageDelete={handleMessageDeleted}
            onMessageEdit={handleMessageEdit}
            users={users}
          />
        )
    }
  }

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen bg-background">
        <Navbar
          currentView={currentView}
          onViewChange={setCurrentView}
          onLogout={handleLogout}
          user={user}
        />
        <main className="flex-1 overflow-hidden relative">
          {renderCurrentView()}
        </main>
      </div>
    </ThemeProvider>
  )
}

export default Index
