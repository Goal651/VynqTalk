
import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { ChatView } from "../components/ChatView";
import { Groups } from "./Groups";
import { Settings } from "./Settings";
import { Notifications } from "./Notifications";
import { AdminPanel } from "./AdminPanel";
import { ThemeProvider } from "../contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { LineWave } from "@/components/LineWave";

const Index = () => {
  const [currentView, setCurrentView] = useState<"chat" | "group" | "settings" | "notifications" | "admin">("chat");
  const { toast } = useToast();
  const { user, logout } = useAuth();

  const handleMessageDeleted = (messageId: string) => {
    toast({
      title: "Message deleted",
      description: "Your message has been deleted successfully.",
    });
  };

  const handleMessageEdit = (message: Message) => {
    toast({
      title: "Edit message",
      description: "You can now edit your message.",
    });
  };

  const handleLogout = () => {
    logout();
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "chat":
        return (
          <ChatView 
            onMessageDelete={handleMessageDeleted} 
            onMessageEdit={handleMessageEdit} 
          />
        );
      case "group":
        return <Groups />;
      case "settings":
        return <Settings />;
      case "notifications":
        return <Notifications />;
      case "admin":
        return <AdminPanel />;
      default:
        return (
          <ChatView 
            onMessageDelete={handleMessageDeleted} 
            onMessageEdit={handleMessageEdit} 
          />
        );
    }
  };

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
          <LineWave className="absolute inset-0 opacity-5" />
          {renderCurrentView()}
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Index;
