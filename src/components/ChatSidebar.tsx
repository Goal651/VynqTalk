
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
  activeChat?: User | null;
}

export const ChatSidebar = ({ users, onUserClick, activeChat }: ChatSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [callType, setCallType] = useState<"audio" | "video" | null>(null);
  const [callingUser, setCallingUser] = useState<User | null>(null);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCall = (user: User, type: "audio" | "video") => {
    console.log("Call initiated:", type, user.name);
    setCallingUser(user);
    setCallType(type);
  };

  const handleUserClick = (user: User) => {
    console.log("User clicked:", user.name);
    onUserClick(user);
  };

  const handleNewChat = () => {
    console.log("New chat clicked");
    // Add logic for new chat creation
  };

  return (
    <div className="w-80 border-r border-border flex flex-col h-full bg-card relative z-10">
      <div className="p-4 border-b border-border bg-background/80">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Chats</h2>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleNewChat}
            className="cursor-pointer hover:bg-accent transition-colors"
            type="button"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search users..."
            className="pl-9 cursor-text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className={`flex items-center p-3 hover:bg-muted/50 cursor-pointer border-b border-border group transition-all duration-200 ${
              activeChat?.id === user.id ? "bg-muted/50 border-l-4 border-l-primary" : "hover:bg-accent/30"
            }`}
            onClick={() => handleUserClick(user)}
          >
            <div className="relative">
              <Avatar className={`cursor-pointer transition-transform hover:scale-105 ${user.isOnline ? "ring-2 ring-green-500" : ""}`}>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {user.isOnline && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background animate-pulse"></span>
              )}
            </div>
            <div className="ml-3 flex-1 overflow-hidden">
              <div className="font-medium text-foreground">{user.name}</div>
              <div className="text-xs text-muted-foreground truncate">
                {activeChat?.id === user.id ? "Active chat" : user.isOnline ? "Online" : "Offline"}
              </div>
            </div>
            <div className="flex space-x-1">
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-green-100 hover:text-green-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCall(user, "audio");
                }}
                type="button"
                title={`Call ${user.name}`}
              >
                <Phone className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-blue-100 hover:text-blue-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCall(user, "video");
                }}
                type="button"
                title={`Video call ${user.name}`}
              >
                <Video className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        {filteredUsers.length === 0 && searchTerm && (
          <div className="p-4 text-center text-muted-foreground">
            No users found matching "{searchTerm}"
          </div>
        )}
      </div>

      {callType && callingUser && (
        <CallPreview 
          user={callingUser} 
          type={callType} 
          isOutgoing={true}
          onAccept={() => {
            console.log("Call accepted");
            // Handle call accept
          }}
          onDecline={() => {
            console.log("Call declined");
            setCallType(null);
            setCallingUser(null);
          }}
        />
      )}
    </div>
  );
};
