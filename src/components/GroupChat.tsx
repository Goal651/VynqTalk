import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, Phone, Video, MoreVertical, Smile, Paperclip } from "lucide-react";
import { Group, GroupMessage, Message } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface GroupChatProps {
  group: Group;
  onBack: () => void;
}

export const GroupChat = ({ group, onBack }: GroupChatProps) => {
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending group message:", newMessage);
      const message: GroupMessage = {
        id: Date.now(),
        content: newMessage,
        senderId: 1,
        timestamp: new Date().toString(),
        type: "text",
        replyToMessage: undefined
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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <Card className="border-b rounded-none flex-shrink-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  console.log("Back button clicked");
                  onBack();
                }}
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
                type="button" 
                variant="ghost" 
                size="icon"
                onClick={handleVoiceCall}
                className="cursor-pointer hover:bg-accent"
              >
                <Phone className="h-4 w-4" />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                onClick={handleVideoCall}
                className="cursor-pointer hover:bg-accent"
              >
                <Video className="h-4 w-4" />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                onClick={handleMoreOptions}
                className="cursor-pointer hover:bg-accent"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === 1 ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderId === 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.senderId !== 1 && (
                  <p className="text-xs text-muted-foreground mb-1">User {message.senderId}</p>
                )}
                {message.replyToMessage && (
                  <div className="text-xs text-muted-foreground mb-1">
                    <span className="font-medium">Replying to {message.replyToMessage.sender.name}</span>
                    <p className="truncate max-w-[200px]">{message.replyToMessage.content}</p>
                  </div>
                )}
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <Card className="border-t rounded-none flex-shrink-0">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleEmojiPicker}
              className="cursor-pointer hover:bg-accent"
            >
              <Smile className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleAttachFile}
              className="cursor-pointer hover:bg-accent"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleSendMessage}
              className="cursor-pointer hover:bg-accent"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
