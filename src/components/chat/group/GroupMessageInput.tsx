import { useState, useRef, useEffect } from "react";
import { User, GroupMessage, MessageType } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Smile, Paperclip, Mic, X, Loader2 } from "lucide-react";
import { EmojiPicker } from "../../EmojiPicker";
import { AudioRecorder } from "../../AudioRecorder";
import { FilePreview } from "../../FilePreview";
import { messageService } from "@/api";
import axios from "axios";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X as CloseIcon } from "lucide-react";

interface GroupMessageInputProps {
  onSendMessage: (content: string, type: MessageType, fileName: string | null, replyTo?: GroupMessage) => void;
  currentUser: User;
  replyTo?: GroupMessage | null;
  onCancelReply?: () => void;
}

// Helper to map file MIME type to MessageType
function getMessageTypeForFile(file: File): MessageType {
  if (file.type.startsWith("image/")) return MessageType.IMAGE;
  if (file.type.startsWith("audio/")) return MessageType.AUDIO;
  if (file.type.startsWith("video/")) return MessageType.VIDEO;
  return MessageType.FILE;
}

const LINK_PREVIEW_API_KEY = "3b3f4d51fc1a85aeab5c0e15b90913fa";

export const GroupMessageInput = ({
  onSendMessage,
  currentUser,
  replyTo,
  onCancelReply
}: GroupMessageInputProps) => {
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
  const [linkPreview, setLinkPreview] = useState<null | { url: string; title?: string; description?: string; image: string }>(null);

  // Regex to detect URLs
  const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

  // Fetch link preview (placeholder logic)
  const fetchLinkPreview = async (url: string) => {
    try {
      const apiUrl = `https://api.linkpreview.net/?key=${LINK_PREVIEW_API_KEY}&q=${encodeURIComponent(url)}`;
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setLinkPreview({
        url,
        title: data.title,
        description: data.description,
        image: data.image || `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}`,
      });
    } catch (err) {
      // Fallback: just show the URL
      setLinkPreview({ url, title: url, image: `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}` });
    }
  };

  // Watch for URLs in the message
  useEffect(() => {
    const urls = message.match(urlRegex);
    if (urls && urls.length > 0) {
      // Only preview the first URL
      if (!linkPreview || linkPreview.url !== urls[0]) {
        fetchLinkPreview(urls[0]);
      }
    } else if (linkPreview) {
      setLinkPreview(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  // Helper: get all file URLs (data URLs, blob URLs, or file names if available)
  const fileUrls = files.map(f => {
    if (typeof f === 'object' && f instanceof File) {
      return f.name;
    }
    return '';
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Group message submitted:", message);

    setIsUploading(true);
    // Send text message if present
    if (message.trim()) {
      onSendMessage(message.trim(), MessageType.TEXT, null, replyTo || undefined);
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
          onSendMessage(response.data, msgType, file.name, replyTo || undefined);
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
    <form onSubmit={handleSubmit} className="sticky bottom-0 left-0 right-0 z-30 bg-secondary/70 border-t border-border shadow-lg px-4 py-3 sm:px-6 sm:py-4 flex flex-col gap-2">

      {files.length > 0 && (
        <div className="mb-2">
          <FilePreview files={files} onRemove={i => setFiles(files => files.filter((_, idx) => idx !== i))} />
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
                case MessageType.IMAGE:
                  return (
                    <img
                      src={r.content}
                      alt={r.fileName || "Image"}
                      className="h-8 w-8 object-cover rounded-md border ml-2"
                    />
                  );
                case MessageType.VIDEO:
                  return (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" /></svg>
                      {r.fileName || "Video"}
                    </span>
                  );
                case MessageType.AUDIO:
                  return (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l-2 2H5a2 2 0 00-2 2v4a2 2 0 002 2h2l2 2zm7-2a2 2 0 100-4 2 2 0 000 4z" /></svg>
                      {r.fileName || "Audio"}
                    </span>
                  );
                case MessageType.FILE:
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

      {/* Link Preview Card (only for http/https URLs and not already in files array) */}
      {linkPreview &&
        (linkPreview.url.startsWith('http://') || linkPreview.url.startsWith('https://')) &&
        !fileUrls.some(fileUrl => linkPreview.url.includes(fileUrl) || fileUrl.includes(linkPreview.url)) && (
          <div className="mt-2 mb-1 p-3 rounded-lg border border-border bg-background flex items-center gap-3 shadow-sm relative animate-fade-in max-w-full w-full overflow-hidden">
            {linkPreview.image && (
              <img src={linkPreview.image} alt="Preview" className="h-12 w-12 min-w-[3rem] max-w-[3rem] object-cover rounded-md border flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0 w-0">
              <div className="font-medium text-sm truncate w-full block">{linkPreview.title || linkPreview.url}</div>
              {linkPreview.description && (
                <div className="text-xs text-muted-foreground line-clamp-2 break-words w-full block">{linkPreview.description}</div>
              )}
              <a href={linkPreview.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline break-all w-full block truncate">
                {linkPreview.url}
              </a>
            </div>
            <Button type="button" size="icon" variant="ghost" className="h-7 w-7 ml-2 flex-shrink-0" onClick={() => setLinkPreview(null)}>
              <CloseIcon className="h-4 w-4" />
            </Button>
          </div>
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
              onSendMessage(response.data, MessageType.AUDIO, 'Voice message', replyTo || undefined);
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

      <div className="flex items-end gap-2 w-full">
        {/* Standalone Emoji Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10 p-0 flex items-center justify-center"
          tabIndex={-1}
          onClick={handleEmojiButtonClick}
        >
          <Smile className="h-6 w-6 text-muted-foreground" />
        </Button>
        {/* Standalone Attachment Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10 p-0 flex items-center justify-center"
          tabIndex={-1}
          onClick={handleFileButtonClick}
        >
          <Paperclip className="h-5 w-5 text-muted-foreground" />
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
        <Textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          onPaste={handlePaste}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (!isDisabled && !isUploading) {
                handleSubmit(e);
              }
            }
          }}
          placeholder="Type a message..."
          className="flex-1 resize-none rounded-2xl px-4 py-2 min-h-[40px] max-h-32 text-base bg-background/80 border border-border focus:ring-2 focus:ring-primary/30 shadow-sm"
          rows={1}
          autoFocus={false}
          disabled={isUploading}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleAudioButtonClick}
          className="h-10 w-10 p-0"
          tabIndex={-1}
        >
          <Mic className="h-6 w-6 text-muted-foreground" />
        </Button>
        <Button
          type="submit"
          variant="default"
          size="icon"
          className="h-10 w-10 p-0 ml-1"
          disabled={isDisabled || isUploading}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>

      {showEmojiPicker && (
        <div className="absolute bottom-16 left-0 z-50">
          <EmojiPicker onEmojiSelect={handleEmojiSelect} />
        </div>
      )}
      {showAudioRecorder && (
        <AudioRecorder
          onCancel={() => setShowAudioRecorder(false)}
          onComplete={async (audioBlob) => {
            // Simulate upload and get URL (replace with real upload logic if needed)
            const audioUrl = URL.createObjectURL(audioBlob);
            onSendMessage(audioUrl, MessageType.AUDIO, "audio.webm", replyTo || undefined);
            setShowAudioRecorder(false);
          }}
        />
      )}
  
    </form>
  );
};

export default GroupMessageInput; 