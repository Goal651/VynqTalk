
import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { ChatView } from "../components/ChatView";
import { ThemeProvider } from "../contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/types";

const Index = () => {
  const [currentView, setCurrentView] = useState<"chat" | "group" | "settings" | "notifications">("chat");
  const { toast } = useToast();

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

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen bg-background">
        <Navbar currentView={currentView} onViewChange={setCurrentView} />
        <main className="flex-1 overflow-hidden">
          {currentView === "chat" && (
            <ChatView 
              onMessageDelete={handleMessageDeleted} 
              onMessageEdit={handleMessageEdit} 
            />
          )}
          {currentView === "group" && <div className="flex items-center justify-center h-full text-accent">Group feature coming soon</div>}
          {currentView === "settings" && <div className="flex items-center justify-center h-full text-accent">Settings feature coming soon</div>}
          {currentView === "notifications" && <div className="flex items-center justify-center h-full text-accent">Notifications feature coming soon</div>}
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Index;
