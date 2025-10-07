import { useState } from "react";
import { User } from '@/types';
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks";
import clsx from "clsx";
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import { Users as UsersIcon } from "lucide-react";
import SidebarUser from "./SidebarUser";

interface ChatSidebarProps {
  users: User[];
  onUserClick: (user: User) => void;
  activeChat?: User | null;
  className?: string;
  onlineUserIds?: Set<number>;
  currentUserId?: number;
  unreadMessages?: import("@/types/message").Message[];
  isLoading?: boolean;
}

export const ChatSidebar = ({ users, onUserClick, activeChat, className, currentUserId, unreadMessages = [], isLoading = false }: ChatSidebarProps) => {
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
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center p-3 border-b border-border gap-3 animate-pulse">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-2 rounded" />
                  <Skeleton className="h-3 w-32 rounded" />
                </div>
              </div>
            ))
          ) : filteredUsers.length === 0 && !searchTerm ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <UsersIcon className="h-10 w-10 mb-2" />
              <span>No users found. Start a conversation!</span>
            </div>
          ) : (
            filteredUsers.map((user, key) => (
              <SidebarUser
                key={key}
                user={user}
                unreadCountByUser={unreadCountByUser}
                currentUserId={currentUserId}
                handleUserClick={handleUserClick}
                activeChat={activeChat}
              />)
            ))}

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
