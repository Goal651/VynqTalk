
import { useState } from "react";
import { User } from "../types";
import { Search, Plus, Phone, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CallPreview } from "./CallPreview";

interface ChatSidebarProps {
  users: User[];
  onUserClick: (user: User) => void;
}

export const ChatSidebar = ({ users, onUserClick }: ChatSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [callType, setCallType] = useState<"audio" | "video" | null>(null);
  const [callingUser, setCallingUser] = useState<User | null>(null);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCall = (user: User, type: "audio" | "video") => {
    setCallingUser(user);
    setCallType(type);
  };

  return (
    <div className="w-80 border-r border-border flex flex-col h-full bg-card">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Chats</h2>
          <Button size="icon" variant="ghost">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center p-3 hover:bg-muted/50 cursor-pointer border-b border-border"
            onClick={() => onUserClick(user)}
          >
            <div className="relative">
              <Avatar className={user.isOnline ? "ring-2 ring-green-500" : ""}>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {user.isOnline && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
              )}
            </div>
            <div className="ml-3 flex-1 overflow-hidden">
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground truncate">
                {user.isOnline ? "Online" : "Offline"}
              </div>
            </div>
            <div className="flex space-x-1">
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCall(user, "audio");
                }}
              >
                <Phone className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCall(user, "video");
                }}
              >
                <Video className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {callType && callingUser && (
        <CallPreview 
          user={callingUser} 
          type={callType} 
          isOutgoing={true}
          onAccept={() => {/* Handle call accept */}}
          onDecline={() => {
            setCallType(null);
            setCallingUser(null);
          }}
        />
      )}
    </div>
  );
};
