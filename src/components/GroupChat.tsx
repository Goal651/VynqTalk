
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Phone, Video, MoreVertical, Smile, Paperclip, Users } from "lucide-react";
import { Group, Message } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface GroupChatProps {
  group: Group;
  onBack: () => void;
}

export const GroupChat = ({ group, onBack }: GroupChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      content: "Hello everyone! Welcome to the group.",
      senderId: "alice_smith",
      timestamp: new Date(Date.now() - 3600000),
      type: "text"
    },
    {
      id: "m2", 
      content: "Thanks for adding me! Looking forward to our discussions.",
      senderId: "bob_jones",
      timestamp: new Date(Date.now() - 1800000),
      type: "text"
    },
    {
      id: "m3",
      content: "Great to have everyone here! Let's get started with our project.",
      senderId: "current-user",
      timestamp: new Date(Date.now() - 900000),
      type: "text"
    }
  ]);
  
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending group message:", newMessage);
      const message: Message = {
        id: `m${Date.now()}`,
        content: newMessage,
        senderId: "current-user",
        timestamp: new Date(),
        type: "text"
      };
      setMessages([...messages, message]);
      setNewMessage("");
      
      toast({
        title: "Message sent",
        description: `Message sent to ${group.name}`,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Message input changed:", e.target.value);
    setNewMessage(e.target.value);
  };

  const handleVoiceCall = () => {
    console.log("Voice call initiated for group:", group.name);
    toast({
      title: "Voice call",
      description: `Starting voice call in ${group.name}`,
    });
  };

  const handleVideoCall = () => {
    console.log("Video call initiated for group:", group.name);
    toast({
      title: "Video call", 
      description: `Starting video call in ${group.name}`,
    });
  };

  const handleMoreOptions = () => {
    console.log("More options clicked for group:", group.name);
    toast({
      title: "More options",
      description: "Group options menu coming soon!",
    });
  };

  const handleAttachFile = () => {
    console.log("Attach file clicked");
    toast({
      title: "File attachment",
      description: "File upload feature coming soon!",
    });
  };

  const handleEmojiPicker = () => {
    console.log("Emoji picker clicked");
    toast({
      title: "Emoji picker",
      description: "Emoji selection coming soon!",
    });
  };

  const getUserDisplayName = (senderId: string) => {
    const userNames: Record<string, string> = {
      "alice_smith": "Alice",
      "bob_jones": "Bob",
      "current-user": "You"
    };
    return userNames[senderId] || senderId;
  };

  const getUserAvatar = (senderId: string) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${senderId}`;
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/20">
      {/* Enhanced Header */}
      <Card className="border-b rounded-none flex-shrink-0 bg-card/80 backdrop-blur-xl border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button type="button" 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  console.log("Back button clicked");
                  onBack();
                }}
                className="cursor-pointer hover:bg-accent/80 rounded-xl transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                    <AvatarImage src={group.avatar} alt={group.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-semibold">
                      {group.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                </div>
                
                <div className="space-y-1">
                  <h2 className="font-bold text-lg text-foreground">{group.name}</h2>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs bg-muted/50 text-muted-foreground">
                      <Users className="h-3 w-3 mr-1" />
                      {group.members.length} members
                    </Badge>
                    <Badge variant="outline" className="text-xs border-green-500/30 text-green-600">
                      Active
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button type="button" 
                variant="ghost" 
                size="icon"
                onClick={handleVoiceCall}
                className="cursor-pointer hover:bg-accent/80 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <Phone className="h-5 w-5" />
              </Button>
              <Button type="button" 
                variant="ghost" 
                size="icon"
                onClick={handleVideoCall}
                className="cursor-pointer hover:bg-accent/80 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <Video className="h-5 w-5" />
              </Button>
              <Button type="button" 
                variant="ghost" 
                size="icon"
                onClick={handleMoreOptions}
                className="cursor-pointer hover:bg-accent/80 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Enhanced Messages Area */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-4">
          {messages.map((message, index) => {
            const isCurrentUser = message.senderId === "current-user";
            const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
            
            return (
              <div
                key={message.id}
                className={`flex items-end space-x-3 animate-fade-in ${
                  isCurrentUser ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                {showAvatar && !isCurrentUser && (
                  <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                    <AvatarImage src={getUserAvatar(message.senderId)} alt={getUserDisplayName(message.senderId)} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-xs font-medium">
                      {getUserDisplayName(message.senderId).substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                {!showAvatar && !isCurrentUser && <div className="w-8" />}
                
                <div className={`flex flex-col space-y-1 max-w-[70%] ${isCurrentUser ? "items-end" : "items-start"}`}>
                  {showAvatar && !isCurrentUser && (
                    <span className="text-xs font-medium text-muted-foreground ml-3">
                      {getUserDisplayName(message.senderId)}
                    </span>
                  )}
                  
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                      isCurrentUser
                        ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-br-md"
                        : "bg-card/80 backdrop-blur-sm border border-border/50 text-foreground rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <div className="flex items-center justify-end mt-1 space-x-1">
                      <span className={`text-xs ${
                        isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isCurrentUser && (
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-primary-foreground/70 rounded-full"></div>
                          <div className="w-1 h-1 bg-primary-foreground/70 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Enhanced Message Input */}
      <Card className="border-t rounded-none flex-shrink-0 bg-card/80 backdrop-blur-xl border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Button type="button" 
              variant="ghost" 
              size="icon"
              onClick={handleAttachFile}
              className="cursor-pointer hover:bg-accent/80 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            
            <div className="flex-1 relative">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="cursor-text bg-background/50 border-border/50 rounded-xl px-4 py-3 pr-12 focus:bg-background/80 transition-all duration-200"
              />
              <Button type="button" 
                variant="ghost" 
                size="icon"
                onClick={handleEmojiPicker}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer hover:bg-accent/80 rounded-lg"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            
            <Button type="button" 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="cursor-pointer bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 rounded-xl px-6 py-3 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
