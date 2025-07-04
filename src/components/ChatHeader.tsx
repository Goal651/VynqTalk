import { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { CallControls } from "./CallControls";

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
            <div className="flex items-center space-x-3 cursor-pointer" onClick={handleUserClick}>
              <div className="relative ">
                <Avatar className={` cursor-pointer transition-transform hover:scale-105 ${isOnline ? "ring-2 ring-green-500" : ""}`}>
                  <AvatarImage src={activeChat.avatar} alt={activeChat.name} className="w-10 h-10 rounded-full" />
                  <AvatarFallback className="rounded-full p-3 bg-primary/10 text-primary font-bold">
                    {activeChat.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isOnline && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background animate-pulse"></span>
                )}
              </div>

              <div>
                <div className="font-semibold text-sm text-foreground">{activeChat.name}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-3">
        {activeChat && (
          <div className="flex items-center space-x-2">
            <CallControls
              activeChat={activeChat}
            />
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
