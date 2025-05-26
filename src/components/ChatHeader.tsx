
import { User } from "../types";
import { Button } from "@/components/ui/button";
import { Phone, Video, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ChatHeaderProps {
  users: User[];
  activeChat?: User | null;
  onVoiceCall?: () => void;
  onVideoCall?: () => void;
}

export const ChatHeader = ({ users, activeChat, onVoiceCall, onVideoCall }: ChatHeaderProps) => {
  const onlineCount = users.filter(user => user.isOnline).length;
  
  const handleVoiceCall = () => {
    console.log("Voice call initiated");
    if (onVoiceCall) onVoiceCall();
  };

  const handleVideoCall = () => {
    console.log("Video call initiated");
    if (onVideoCall) onVideoCall();
  };
  
  return (
    <div className="p-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-background via-secondary/30 to-background backdrop-blur-sm sticky top-0 z-10 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            PulseChat
          </h1>
          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-xs font-medium text-green-700 dark:text-green-300">
            {onlineCount} online
          </div>
        </div>
        
        {activeChat && (
          <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-border/50">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <img 
                  src={activeChat.avatar} 
                  alt={activeChat.name}
                  className="w-8 h-8 rounded-full border-2 border-background shadow-sm"
                />
                {activeChat.isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                )}
              </div>
              <div>
                <p className="font-medium text-sm">{activeChat.name}</p>
                <p className="text-xs text-muted-foreground">
                  {activeChat.isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {activeChat && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVoiceCall}
              className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary transition-colors rounded-full"
            >
              <Phone className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVideoCall}
              className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary transition-colors rounded-full"
            >
              <Video className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-accent transition-colors rounded-full">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border border-border shadow-lg">
                <DropdownMenuItem className="cursor-pointer hover:bg-accent transition-colors">
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-accent transition-colors">
                  Mute Notifications
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-accent transition-colors text-destructive focus:text-destructive">
                  Block User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}

        <div className="flex -space-x-2">
          {users.slice(0, 3).map((user) => (
            <div 
              key={user.id} 
              className="relative w-8 h-8 rounded-full border-2 border-background overflow-hidden shadow-sm hover:scale-105 transition-transform cursor-pointer"
              title={user.name}
            >
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-full h-full object-cover"
              />
              {user.isOnline && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full"></span>
              )}
            </div>
          ))}
          {users.length > 3 && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center text-xs font-semibold border-2 border-background shadow-sm hover:scale-105 transition-transform cursor-pointer">
              +{users.length - 3}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
