import { User } from "../types";
import { Button } from "@/components/ui/button";
import { Phone, Video, MoreVertical, MessageSquare } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { socketService } from "@/api/services/socket"
import { useEffect, useState } from "react";

interface ChatHeaderProps {
  users: User[];
  activeChat?: User | null;
  onVoiceCall?: () => void;
  onVideoCall?: () => void;
}


export const ChatHeader = ({ users, activeChat, onVoiceCall, onVideoCall }: ChatHeaderProps) => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  useEffect(() => {
    socketService.connect()
    const handleUsers = (users: string[]) => {
      setOnlineUsers(users);
    };
  
    socketService.onOnlineUsersChange(handleUsers);
    return () => {
      socketService.disconnect()
    }
  }, [])


  const handleVoiceCall = () => {
    console.log("Voice call initiated");
    if (onVoiceCall) onVoiceCall();
  };

  const handleVideoCall = () => {
    console.log("Video call initiated");
    if (onVideoCall) onVideoCall();
  };

  return (
    <div className="p-4 border-b border-border/30 flex items-center justify-between bg-gradient-to-r from-card/80 via-card to-card/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
              Chat
            </h1>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-xs font-medium text-green-700 dark:text-green-300 shadow-sm">
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span>{onlineUsers.length} online</span>
            </div>
          </div>
        </div>

        {activeChat && (
          <div className="flex items-center space-x-3 ml-6 pl-4 border-l border-border/50">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={activeChat.avatar}
                  alt={activeChat.name}
                  className="w-9 h-9 rounded-full border-2 border-primary/20 shadow-md ring-2 ring-background"
                />
                {activeChat.isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full shadow-sm"></span>
                )}
              </div>
              <div>
                <div className="font-semibold text-sm text-foreground">{activeChat.name}</div>
                <div className="text-xs text-muted-foreground flex items-center">
                  <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${activeChat.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                  {activeChat.isOnline ? "Active now" : "Offline"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-3">
        {activeChat && (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVoiceCall}
              className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-200 rounded-full border border-primary/20 bg-primary/5"
            >
              <Phone className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVideoCall}
              className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-200 rounded-full border border-primary/20 bg-primary/5"
            >
              <Video className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-accent transition-all duration-200 rounded-full">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-sm border border-border shadow-xl rounded-lg">
                <DropdownMenuItem className="cursor-pointer hover:bg-accent/50 transition-colors rounded-md">
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-accent/50 transition-colors rounded-md">
                  Mute Notifications
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-accent/50 transition-colors text-destructive focus:text-destructive rounded-md">
                  Block User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <div className="flex -space-x-2">
          {users.slice(0, 4).map((user) => (
            <div
              key={user.id}
              className="relative w-8 h-8 rounded-full border-2 border-background overflow-hidden shadow-md hover:scale-110 hover:z-10 transition-all duration-200 cursor-pointer ring-1 ring-primary/10"
              title={user.name}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
              {user.isOnline && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full shadow-sm"></span>
              )}
            </div>
          ))}
          {users.length > 4 && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/80 to-primary/20 flex items-center justify-center text-xs font-bold border-2 border-background shadow-md hover:scale-110 transition-all duration-200 cursor-pointer ring-1 ring-primary/10">
              +{users.length - 4}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
