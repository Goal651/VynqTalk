import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useState, useEffect } from "react";
import { SocketProvider } from "./contexts/SocketContext";
import { ChatView } from "./components/ChatView";
import { Groups } from "./pages/Groups";
import { Settings } from "./pages/Settings";
import { Notifications } from "./pages/Notifications";
import { AdminPanel } from "./pages/AdminPanel";
import { useToast } from "@/hooks/use-toast";
import { Message, User } from "@/types";
import { userService } from "@/api/services/users";
import { messageService } from "@/api/services/messages";
import { useSocket } from "@/contexts/SocketContext";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Short timeout to allow auth state to be checked
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// Wrapper to provide ChatView props from Index
const ChatViewWrapper = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Map<string, string>>(new Map());
  const socket = useSocket();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getAllUsers();
        if (response && response.data) setUsers(response.data);
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: "Error",
            description: "There was an error fetching users.",
            variant: "destructive",
          });
        }
      }
    };
    fetchUsers();
  }, [toast]);

  useEffect(() => {
    if (!socket) return;
    const handleUsers = (users: Map<string, string>) => {
      setOnlineUsers(users);
    };
    socket.onOnlineUsersChange(handleUsers);
    return () => {
      socket.removeOnlineUsersListener(handleUsers);
    };
  }, [socket]);

  const handleMessageDeleted = async (messageId: number) => {
    try {
      await messageService.deleteMessage(messageId);
      toast({
        title: "Message deleted",
        description: "Your message has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error deleting your message.",
        variant: "destructive",
      });
    }
  };

  const handleMessageEdit = async (message: Message) => {
    try {
      await messageService.updateMessage(message.id, message);
      toast({
        title: "Message updated",
        description: "Your message has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating your message.",
        variant: "destructive",
      });
    }
  };

  return (
    <ChatView
      onMessageDelete={handleMessageDeleted}
      onMessageEdit={handleMessageEdit}
      users={users}
      onlineUsers={onlineUsers}
    />
  );
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        }
      >
        <Route path="chat" element={<ChatViewWrapper />} />
        <Route path="group" element={<Groups />} />
        <Route path="settings" element={<Settings />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="admin" element={<AdminPanel />} />
        <Route index element={<Navigate to="chat" />} />
      </Route>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
