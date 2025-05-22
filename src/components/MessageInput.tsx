
import { useState, useRef } from "react";
import { User } from "../types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Smile, Paperclip, Mic, Image } from "lucide-react";
import { EmojiPicker } from "./EmojiPicker";
import { AudioRecorder } from "./AudioRecorder";
import { FilePreview } from "./FilePreview";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  currentUser: User;
}

export const MessageInput = ({ onSendMessage, currentUser }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || files.length > 0) {
      let content = message.trim();
      
      // In a real app, you would upload files and add them to the message
      if (files.length > 0) {
        content += ` [${files.length} file(s) attached]`;
      }
      
      onSendMessage(content);
      setMessage("");
      setFiles([]);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
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

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-secondary/50">
      {files.length > 0 && <FilePreview files={files} onRemove={(index) => {
        setFiles(files.filter((_, i) => i !== index));
      }} />}
      
      {showAudioRecorder && (
        <AudioRecorder 
          onComplete={(audioBlob) => {
            // In a real app, you would handle the audio blob
            console.log("Audio recorded:", audioBlob);
            setShowAudioRecorder(false);
          }}
          onCancel={() => setShowAudioRecorder(false)}
        />
      )}
      
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
            onPaste={handlePaste}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          />
          <div className="absolute right-3 bottom-3">
            <Button 
              type="submit" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              disabled={!message.trim() && files.length === 0}
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
              className="h-8 w-8 rounded-full"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="h-4 w-4" />
            </Button>
            {showEmojiPicker && (
              <div className="absolute bottom-10 left-0 z-10">
                <EmojiPicker onEmojiSelect={handleEmojiSelect} />
              </div>
            )}
          </div>
          
          <Button 
            type="button" 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 rounded-full"
            onClick={() => fileInputRef.current?.click()}
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
          
          <Button 
            type="button" 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 rounded-full"
            onClick={() => setShowAudioRecorder(true)}
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
