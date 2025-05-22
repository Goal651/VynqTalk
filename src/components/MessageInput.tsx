
import { useState } from "react";
import { User } from "../types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  currentUser: User;
}

export const MessageInput = ({ onSendMessage, currentUser }: MessageInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-secondary/50">
      <div className="flex items-end space-x-2">
        <div className="relative flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="min-h-[60px] w-full resize-none bg-muted rounded-lg pr-12"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <div className="absolute right-3 bottom-3">
            <Button 
              type="submit" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              disabled={!message.trim()}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center text-xs text-muted-foreground">
          <span>Sending as <span className="font-semibold text-accent">{currentUser.name}</span></span>
        </div>
        <div className="text-xs text-muted-foreground">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </form>
  );
};
