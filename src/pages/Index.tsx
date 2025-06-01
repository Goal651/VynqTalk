
import { useState } from "react";
import { ChatView } from "@/components/ChatView";
import { GroupChat } from "@/components/GroupChat";
import { AdminPanel } from "./AdminPanel";
import { Settings } from "./Settings";
import { Notifications } from "./Notifications";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { mockUsers } from "@/data/mockData";
import { Message } from "@/types";

const Index = () => {
  const [currentView, setCurrentView] = useState<"chat" | "group" | "settings" | "notifications" | "admin">("chat");
  const { user, logout } = useAuth();

  const handleMessageDelete = (messageId: string) => {
    console.log("Message deleted:", messageId);
  };

  const handleMessageEdit = (message: Message) => {
    console.log("Message edited:", message);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "chat":
        return (
          <ChatView
            users={mockUsers}
            onMessageDelete={handleMessageDelete}
            onMessageEdit={handleMessageEdit}
          />
        );
      case "group":
        return <GroupChat />;
      case "settings":
        return <Settings />;
      case "notifications":
        return <Notifications />;
      case "admin":
        return <AdminPanel />;
      default:
        return <ChatView users={mockUsers} />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={logout}
        user={user || undefined}
      />
      <main className="flex-1 overflow-hidden">
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default Index;
