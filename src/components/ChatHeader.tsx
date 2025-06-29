import { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Phone, Video, MoreVertical, MessageSquare } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ChatHeaderProps {
  onlineUsers: Map<string, string>;
  onUserClick?: (user: User) => void;
  activeChat?: User | null;
  onVoiceCall?: () => void;
  onVideoCall?: () => void;
}


export const ChatHeader = ({ onlineUsers, activeChat, onVoiceCall, onVideoCall, onUserClick }: ChatHeaderProps) => {
  const handleVoiceCall = () => {
    console.log("Voice call initiated");
    if (onVoiceCall) onVoiceCall();
  };

  const handleVideoCall = () => {
    console.log("Video call initiated");
    if (onVideoCall) onVideoCall();
  };

  const isOnline = onlineUsers.has(activeChat?.email)

  const handleUserClick = () => {
    console.log("User avatar clicked:", activeChat?.name)
    if (onUserClick) onUserClick(activeChat)
  }

  return (
    <div className="p-4 border-b border-border/30 flex items-center justify-between bg-gradient-to-r from-card/80 via-card to-card/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
      <div className="flex items-center space-x-4">

        {activeChat && (
          <div className="flex items-center space-x-3 ">
            <div className="flex items-center space-x-3 cursor-pointer"   onClick={ handleUserClick}>
              <div className="relative"
              
              >
                <img
                  src={activeChat.avatar||''}
                  alt={activeChat.name}
                  className="w-9 h-9 rounded-full border-2 border-primary/20 shadow-md ring-2 ring-background overflow-hidden"
                />
                {isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full shadow-sm"></span>
                )}
              </div>
              <div>
                <div className="font-semibold text-sm text-foreground">{activeChat.name}</div>
                <div className="text-xs text-muted-foreground flex items-center">
                  <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${activeChat.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                  {isOnline ? "Active now" : "Offline"}
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


      </div>
    </div>
  );
};
