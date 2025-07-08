import { useState, useRef } from "react";
import { User, Message, MessageType } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Smile, Paperclip, Mic, X, Loader2 } from "lucide-react";
import { EmojiPicker } from "./EmojiPicker";
import { AudioRecorder } from "./AudioRecorder";
import { FilePreview } from "./FilePreview";
import { messageService } from "@/api";
import axios from "axios";
import { toast } from "sonner";

interface MessageInputProps {
  onSendMessage: (content: string, type: MessageType, fileName: string|null, replyTo?: Message) => void;
  currentUser: User;
  replyTo?: Message;
  onCancelReply?: () => void;
}

// Helper to map file MIME type to MessageType
function getMessageTypeForFile(file: File): MessageType {
  if (file.type.startsWith("image/")) return "IMAGE";
  if (file.type.startsWith("audio/")) return "AUDIO";
  if (file.type.startsWith("video/")) return "VIDEO";
  return "FILE";
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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{
    file: File;
    progress: number;
    cancel: () => void;
  }[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Message submitted:", message);

    setIsUploading(true);
    // Send text message if present
    if (message.trim()) {
      onSendMessage(message.trim(), 'TEXT',null, replyTo);
    }

    // Upload and send each file with progress and cancel support
    for (const file of files) {
      const source = axios.CancelToken.source();
      setUploadingFiles(prev => [...prev, { file, progress: 0, cancel: source.cancel }]);
      try {
        const response = await messageService.uploadMessage(file, (event: import('axios').AxiosProgressEvent) => {
          const percent = event.total ? Math.round((event.loaded * 100) / event.total) : 0;
          setUploadingFiles(prev => prev.map(f => f.file === file ? { ...f, progress: percent } : f));
        }, source.token, 60000);
        if (response.success && response.data) {
          const msgType = getMessageTypeForFile(file);
          onSendMessage(response.data, msgType, file.name,replyTo);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Upload cancelled for", file.name);
        } else {
          console.error("File upload failed:", error);
          toast.error(
            error?.message?.includes("timeout")
              ? `Upload timed out for ${file.name}. Try a smaller file or check your connection.`
              : `Failed to upload ${file.name}`
          );
        }
      } finally {
        setUploadingFiles(prev => prev.filter(f => f.file !== file));
      }
    }
    setIsUploading(false);
    setMessage("");
    setFiles([]);
    setShowEmojiPicker(false);
    if (onCancelReply) {
      onCancelReply();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
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
    fileInputRef.current?.click();
  };

  const handleEmojiButtonClick = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleAudioButtonClick = () => {
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
      {isUploading && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50 rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-primary font-medium">Uploading...</span>
        </div>
      )}

      {replyTo && (
        <div className="flex flex-col mb-2">
          <div className="flex items-center gap-2 bg-muted/70 border-l-4 border-primary rounded-md px-3 py-2 shadow-sm">
            <span className="block text-xs font-semibold text-primary">
              Replying to {replyTo.sender.id === currentUser.id ? "yourself" : replyTo.sender.name}
            </span>
            {(() => {
              const r = replyTo;
              switch (r.type) {
                case "IMAGE":
                  return (
                    <img
                      src={r.content}
                      alt={r.fileName || "Image"}
                      className="h-8 w-8 object-cover rounded-md border ml-2"
                    />
                  );
                case "VIDEO":
                  return (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" /></svg>
                      {r.fileName || "Video"}
                    </span>
                  );
                case "AUDIO":
                  return (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l-2 2H5a2 2 0 00-2 2v4a2 2 0 002 2h2l2 2zm7-2a2 2 0 100-4 2 2 0 000 4z" /></svg>
                      {r.fileName || "Audio"}
                    </span>
                  );
                case "FILE":
                  return (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" /></svg>
                      {r.fileName || "File"}
                    </span>
                  );
                default:
                  return (
                    <span className="block text-xs text-muted-foreground truncate max-w-[200px] ml-2">
                      {r.content}
                    </span>
                  );
              }
            })()}
          </div>
          <div className="w-full h-px bg-border/60 my-1" />
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
          onComplete={async (audioBlob) => {
            setIsUploading(true);
            console.log("Audio recorded:", audioBlob);
            // Convert Blob to File
            const audioFile = new File([audioBlob], `audio-${Date.now()}.webm`, { type: 'audio/webm' });
            const response = await messageService.uploadMessage(audioFile, undefined, undefined, 60000);
            if (response.success && response.data) {
              onSendMessage(response.data, 'AUDIO', 'Voice message',replyTo);
            }
            setIsUploading(false);
            setShowAudioRecorder(false);
          }}
          onCancel={() => {
            console.log("Audio recording cancelled");
            setShowAudioRecorder(false);
          }}
        />
      )}

      {uploadingFiles.length > 0 && (
        <div className="mb-2 space-y-2">
          {uploadingFiles.map(({ file, progress, cancel }) => (
            <div key={file.name + file.size} className="flex items-center gap-2 bg-muted rounded p-2">
              <span className="truncate max-w-[120px] text-xs">{file.name}</span>
              <div className="flex-1 h-2 bg-secondary rounded">
                <div
                  className="h-2 bg-primary rounded"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs w-10 text-right">{progress}%</span>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={cancel}
                title="Cancel upload"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
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
              className={`h-8 w-8 rounded-full cursor-pointer transition-all ${isDisabled || isUploading || uploadingFiles.length > 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-105 hover:bg-primary/90"
                }`}
              disabled={isDisabled || isUploading || uploadingFiles.length > 0}
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
