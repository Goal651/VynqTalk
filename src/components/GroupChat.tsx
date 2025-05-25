
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, Send, Phone, Video, MoreVertical, Smile, Paperclip } from "lucide-react";
import { Group, Message } from "@/types";

interface GroupChatProps {
  group: Group;
  onBack: () => void;
}

export const GroupChat = ({ group, onBack }: GroupChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      content: "Hello everyone! Welcome to the group.",
      userId: "u1", // Using userId instead of senderId
      timestamp: new Date(Date.now() - 3600000),
      type: "text"
    },
    {
      id: "m2", 
      content: "Thanks for adding me!",
      userId: "u2", // Using userId instead of senderId
      timestamp: new Date(Date.now() - 1800000),
      type: "text"
    }
  ]);
  
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage);
      const message: Message = {
        id: `m${Date.now()}`,
        content: newMessage,
        userId: "current-user", // Using userId instead of senderId
        timestamp: new Date(),
        type: "text"
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <Card className="border-b rounded-none">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onBack}
                className="cursor-pointer hover:bg-accent"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Avatar>
                <AvatarImage src={group.avatar} alt={group.name} />
                <AvatarFallback>{group.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{group.name}</h2>
                <p className="text-sm text-muted-foreground">{group.members.length} members</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => console.log("Voice call initiated")}
                className="cursor-pointer hover:bg-accent"
              >
                <Phone className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => console.log("Video call initiated")}
                className="cursor-pointer hover:bg-accent"
              >
                <Video className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => console.log("More options clicked")}
                className="cursor-pointer hover:bg-accent"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.userId === "current-user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.userId === "current-user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {message.userId !== "current-user" && (
                <p className="text-xs text-muted-foreground mb-1">User {message.userId}</p>
              )}
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <Card className="border-t rounded-none">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => console.log("Attach file clicked")}
              className="cursor-pointer hover:bg-accent"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 cursor-text"
            />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => console.log("Emoji picker clicked")}
              className="cursor-pointer hover:bg-accent"
            >
              <Smile className="h-4 w-4" />
            </Button>
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
