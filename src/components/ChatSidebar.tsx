import { useState } from "react";
import { User } from '@/types';
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks";
import clsx from "clsx";
import { formatDistanceToNow } from 'date-fns';

interface ChatSidebarProps {
  users: User[];
  onUserClick: (user: User) => void;
  activeChat?: User | null;
  className?: string;
  onlineUserIds?: Set<number>;
  currentUserId?: number;
  unreadMessages?: import("@/types/message").Message[];
}

export const ChatSidebar = ({ users, onUserClick, activeChat, className, onlineUserIds = new Set(), currentUserId, unreadMessages = [] }: ChatSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [callType, setCallType] = useState<"audio" | "video" | null>(null);
  const [callingUser, setCallingUser] = useState<User | null>(null);
  const { toast } = useToast();

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Count unread messages per user (by sender.id)
  const unreadCountByUser: Record<number, number> = {};
  unreadMessages.forEach(msg => {
    if (msg.sender && typeof msg.sender.id === 'number') {
      unreadCountByUser[msg.sender.id] = (unreadCountByUser[msg.sender.id] || 0) + 1;
    }
  });

  const handleCall = (user: User, type: "audio" | "video") => {
    console.log("Call initiated:", type, "with", user.name);
    setCallingUser(user);
    setCallType(type);

    toast({
      title: `${type === "audio" ? "Voice" : "Video"} call`,
      description: `Calling ${user.name}...`,
    });
  };

  const handleUserClick = (user: User) => {
    onUserClick(user);
  };


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={clsx("w-80 border-r border-border flex flex-col h-full bg-card relative z-10", className)}>
      <div className="p-2 border-b border-border bg-background/80 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search users..."
            className="pl-9 cursor-text"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-0">
          {filteredUsers.map((user) => {
            const isCurrentUser = user.id === currentUserId;
            const isOnline = onlineUserIds.has(user.id);
            const latestMessage = user.latestMessage;
            const unreadCount = unreadCountByUser[user.id] || 0;
            return (
              <div
                key={user.id}
                className={`flex items-center p-3 hover:bg-muted/50 cursor-pointer border-b border-border group transition-all duration-200 ${activeChat?.id === user.id ? "bg-muted/50 border-l-4 border-l-primary" : "hover:bg-accent/30"
                  }`}
                onClick={() => handleUserClick(user)}
              >
                <div className="relative">
                  <Avatar className={`cursor-pointer transition-transform hover:scale-105`}>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {!isCurrentUser && (
                    <span
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow ${isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                      title={isOnline ? "Online" : "Offline"}
                    />
                  )}
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow border border-white min-w-[18px] text-center select-none" title={`${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`}>{unreadCount > 9 ? '9+' : unreadCount}</span>
                  )}
                </div>
                <div className="ml-3 flex-1 overflow-hidden">
                  <div className="font-medium text-foreground truncate">{user.name}</div>
                  {latestMessage && (
                    <div className="text-xs text-muted-foreground truncate flex items-center gap-2">
                      <span className="truncate max-w-[10rem]">{latestMessage.content}</span>
                      {latestMessage.timestamp && (
                        <span className="whitespace-nowrap">· {formatDistanceToNow(new Date(latestMessage.timestamp), { addSuffix: true })}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredUsers.length === 0 && searchTerm && (
            <div className="p-4 text-center text-muted-foreground">
              No users found matching "{searchTerm}"
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
