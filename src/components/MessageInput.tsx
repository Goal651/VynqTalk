import { useState, useRef } from "react";
import { User, Message } from "../types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Smile, Paperclip, Mic, X } from "lucide-react";
import { EmojiPicker } from "./EmojiPicker";
import { AudioRecorder } from "./AudioRecorder";
import { FilePreview } from "./FilePreview";

interface MessageInputProps {
  onSendMessage: (content: string, replyTo?: Message) => void;
  currentUser: User;
  replyTo?: Message;
  onCancelReply?: () => void;
}

export const MessageInput = ({ 
  onSendMessage, 
  currentUser, 
  replyTo,
  onCancelReply 
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Message submitted:", message);
    
    if (message.trim() || files.length > 0) {
      let content = message.trim();
      
      // In a real app, you would upload files and add them to the message
      if (files.length > 0) {
        content += ` [${files.length} file(s) attached]`;
      }
      
      onSendMessage(content, replyTo);
      setMessage("");
      setFiles([]);
      setShowEmojiPicker(false);
      
      if (onCancelReply) {
        onCancelReply();
      }
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    console.log("Emoji selected:", emoji);
    setMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Files selected");
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleFileButtonClick = () => {
    console.log("File button clicked");
    fileInputRef.current?.click();
  };

  const handleEmojiButtonClick = () => {
    console.log("Emoji button clicked");
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleAudioButtonClick = () => {
    console.log("Audio button clicked");
    setShowAudioRecorder(true);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    const newFiles: File[] = [];

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) newFiles.push(file);
      }
    }

    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const newFiles: File[] = [];
    
    if (e.dataTransfer.items) {
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        if (e.dataTransfer.items[i].kind === "file") {
          const file = e.dataTransfer.items[i].getAsFile();
          if (file) newFiles.push(file);
        }
      }
    } else {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        newFiles.push(e.dataTransfer.files[i]);
      }
    }

    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const isDisabled = !message.trim() && files.length === 0;

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-secondary/50 relative z-10">
      {replyTo && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageCircle className="h-4 w-4" />
          <span>
            Replying to {replyTo.sender.id === currentUser.id ? "yourself" : replyTo.sender.name}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-accent"
            onClick={onCancelReply}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {files.length > 0 && (
        <FilePreview 
          files={files} 
          onRemove={(index) => {
            console.log("File removed:", index);
            setFiles(files.filter((_, i) => i !== index));
          }} 
        />
      )}
      
      {showAudioRecorder && (
        <AudioRecorder 
          onComplete={(audioBlob) => {
            console.log("Audio recorded:", audioBlob);
            setShowAudioRecorder(false);
          }}
          onCancel={() => {
            console.log("Audio recording cancelled");
            setShowAudioRecorder(false);
          }}
        />
      )}
      
      <div className="flex items-end space-x-2">
        <div className="relative flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={replyTo ? "Reply to message..." : "Type a message..."}
            className="min-h-[60px] w-full resize-none bg-muted rounded-lg pr-12 cursor-text focus:ring-2 focus:ring-primary transition-all"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            onPaste={handlePaste}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          />
          <div className="absolute right-3 bottom-3">
            <Button 
              type="submit" 
              size="icon" 
              className={`h-8 w-8 rounded-full cursor-pointer transition-all ${
                isDisabled 
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:scale-105 hover:bg-primary/90"
              }`}
              disabled={isDisabled}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Button 
              type="button" 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 rounded-full cursor-pointer hover:bg-accent transition-colors"
              onClick={handleEmojiButtonClick}
              title="Add emoji"
            >
              <Smile className="h-4 w-4" />
            </Button>
            {showEmojiPicker && (
              <div className="absolute bottom-10 left-0 z-50">
                <EmojiPicker onEmojiSelect={handleEmojiSelect} />
              </div>
            )}
          </div>
          
          <Button type="button" 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 rounded-full cursor-pointer hover:bg-accent transition-colors"
            onClick={handleFileButtonClick}
            title="Attach file"
          >
            <Paperclip className="h-4 w-4" />
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              multiple 
              onChange={handleFileChange} 
            />
          </Button>
          
          <Button type="button" 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 rounded-full cursor-pointer hover:bg-accent transition-colors"
            onClick={handleAudioButtonClick}
            title="Record audio"
          >
            <Mic className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </form>
  );
};
