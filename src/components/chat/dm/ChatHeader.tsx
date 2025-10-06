import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { MoreVertical, ChevronLeft } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { CallControls } from "../../CallControls";
import { useIsMobile } from "@/hooks";

interface ChatHeaderProps {
  onlineUsers: Set<number>;
  onUserClick?: (user: User) => void;
  activeChat?: User | null;
  onVoiceCall?: () => void;
  onVideoCall?: () => void;
  onBack?: () => void;
}


export const ChatHeader = ({
  onlineUsers,
  activeChat,
  onVoiceCall,
  onVideoCall,
  onUserClick,
  onBack,
}: ChatHeaderProps) => {
  const isMobile = useIsMobile();
  const isOnline = !!(activeChat && onlineUsers.has(activeChat.id));

  const handleUserClick = () => {
    if (onUserClick) onUserClick(activeChat);
  };

  return (
    <div
      className={
        isMobile
          ? "p-2 border-b border-border/30 flex items-center justify-between bg-gradient-to-r from-card/80 via-card to-card/80 backdrop-blur-md sticky top-0 z-10 shadow-md w-full"
          : "p-4 border-b border-border/30 flex items-center justify-between bg-gradient-to-r from-card/80 via-card to-card/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm w-full"
      }
    >
      <div className={isMobile ? "flex items-center space-x-2" : "flex items-center space-x-4"}>
        {/* Back button for mobile navigation, only if onBack is provided */}
        {onBack && (
          <button
            onClick={onBack}
            className="mr-2 p-2 rounded-full hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Back"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        {activeChat && (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={handleUserClick}>
              <div className="relative">
                <Avatar
                  className={`rounded-full w-12 h-12 cursor-pointer transition-transform hover:scale-105 ${
                    isOnline ? "ring-2 ring-green-500" : ""
                  }`}
                >
                  <AvatarImage
                    src={activeChat.avatar}
                    alt={activeChat.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <AvatarFallback className="rounded-full h-10 w-10 p-3 bg-primary/10 text-primary font-bold">
                    {activeChat.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isOnline && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background animate-pulse"></span>
                )}
              </div>
              <div>
                <div className="font-semibold text-sm text-foreground">
                  {activeChat.name}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        className="flex items-center space-x-3 w-auto"
      >
        {activeChat && (
          <div className="flex items-center space-x-2">
            <CallControls activeChat={activeChat} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 hover:bg-accent transition-all duration-200 rounded-full"
                >
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
