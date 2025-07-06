import { useState } from "react";
import { User } from '@/types';
import { Search, Plus, Phone, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import clsx from "clsx";

interface ChatSidebarProps {
  users: User[];
  onUserClick: (user: User) => void;
  activeChat?: User | null;
  className?: string;
}

export const ChatSidebar = ({ users, onUserClick, activeChat, className }: ChatSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [callType, setCallType] = useState<"audio" | "video" | null>(null);
  const [callingUser, setCallingUser] = useState<User | null>(null);
  const { toast } = useToast();

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    console.log("User clicked in sidebar:", user.name);
    onUserClick(user);
  };

  const handleNewChat = () => {
    console.log("New chat clicked");
    toast({
      title: "New Chat",
      description: "Feature coming soon!",
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Search term changed:", e.target.value);
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
          {filteredUsers.map((user) => (
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
              </div>
              <div className="ml-3 flex-1 overflow-hidden">
                <div className="font-medium text-foreground">{user.name}</div>
              </div>
            </div>
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
