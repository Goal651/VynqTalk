import { Message, User, Reaction } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator
} from "@/components/ui/context-menu";
import { Edit, Trash2, Reply, Copy, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUsers } from "@/contexts/UsersContext";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { CustomVideoPlayer } from "./CustomVideoPlayer";
import { CustomAudioPlayer } from "./CustomAudioPlayer";

interface MessageBubbleProps {
  message: Message;
  user: User;
  onUserAvatarClick?: () => void;
  onDeleteMessage?: () => void;
  onEditMessage?: () => void;
  onReplyMessage?: (message: Message) => void;
  onReactToMessage?: (messageId: number, reaction: Reaction) => void;
  currentUserId?: number;
  onMediaClick?: (messageId: number) => void;
}

export const MessageBubble = ({
  message,
  user,
  onUserAvatarClick,
  onDeleteMessage,
  onEditMessage,
  onReplyMessage,
  onReactToMessage,
  currentUserId,
  onMediaClick
}: MessageBubbleProps) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const isCurrentUser = user.id === currentUserId;
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const { getUserName, users } = useUsers();

  const handleAvatarClick = () => {
    console.log("Avatar clicked:", user.name);
    if (onUserAvatarClick) {
      onUserAvatarClick();
    }
  };

  const handleDeleteClick = () => {
    console.log("Delete message clicked:", message.id);
    if (onDeleteMessage) {
      onDeleteMessage();
    }
  };

  const handleEditClick = () => {
    console.log("Edit message clicked:", message.id);
    if (onEditMessage) {
      onEditMessage();
    }
  };

  const handleReplyClick = () => {
    console.log("Reply message clicked:", message.id);
    if (onReplyMessage) {
      onReplyMessage(message);
    }
  };

  const handleCopyClick = async () => {
    console.log("Copy message clicked:", message.id);
    try {
      await navigator.clipboard.writeText(message.content);
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };

  const handleReactClick = () => {
    console.log("React button clicked:", message.id);
    setShowReactionPicker(!showReactionPicker);
  };

  const handleEmojiSelect = (emoji: string) => {
    console.log("Emoji selected:", emoji, "for message:", message.id);
    if (onReactToMessage) {
      const newReaction: Reaction = {
        userId: currentUserId,
        emoji,
      }
      onReactToMessage(message.id, newReaction);
    }
    setShowReactionPicker(false);
  };

  const reactionEmojis = ["❤️", "😂", "😮", "😢", "😡", "👍", "👎", "🔥"];

  // Group reactions by emoji and collect userIds
  const reactionsByEmoji = message.reactions?.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) acc[reaction.emoji] = [];
    acc[reaction.emoji].push(reaction.userId);
    return acc;
  }, {} as Record<string, number[]>) || {};

  // Set of emojis the current user has reacted to
  const userReactedEmojis = new Set(
    message.reactions?.filter(r => r.userId === currentUserId).map(r => r.emoji)
  );

  const messageBubble = (
    <div className="relative">
      {message.replyTo && (
        <div className="flex flex-col mb-2">
          <div className="flex items-center gap-2 bg-muted/70 border-l-4 border-primary rounded-md px-3 py-2 shadow-sm">
            <span className="block text-xs font-semibold text-primary">
              Replying to {message.replyTo.sender.name}
            </span>
            {(() => {
              const r = message.replyTo;
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

      <div
        className={`max-w-xs min-w-24 lg:max-w-md px-4 py-2 rounded-lg shadow-sm relative ${isCurrentUser
          ? "bg-primary text-primary-foreground ml-auto"
          : "bg-muted text-foreground mr-auto"
          }`}
      >
        {!isCurrentUser && (
          <p className="text-xs text-muted-foreground mb-1">{message.sender.name}</p>
        )}

        {/* Message content rendering based on type */}
        {message.type === "TEXT" && (
          <div className="break-words whitespace-pre-wrap mb-2">{message.content}</div>
        )}
        {message.type === "IMAGE" && message.content && (
          <img
            src={message.content}
            alt={message.fileName || "Image"}
            className="max-w-full rounded-md cursor-pointer mb-2"
            style={{ maxHeight: 300 }}
            onClick={() => onMediaClick?.(message.id)}
          />
        )}
        {message.type === "AUDIO" && message.content && (
          <div className="w-full my-2">
            <CustomAudioPlayer src={message.content} />
          </div>
        )}
        {message.type === "FILE" && message.content && (
          <div className="flex items-center gap-2 my-2">
            <a
              href={message.content}
              download={message.fileName || undefined}
              className="relative flex flex-col items-center gap-1  break-all "
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="">{message.fileName || "Download file"}</span>
              
                <File
                  className="w-full h-full rounded-md cursor-pointer mb-2"
                  style={{ maxHeight: 300 }}
                />
              
            </a>
          </div>
        )}
        {message.type === "VIDEO" && message.content && (
          <div className="w-full mt-2 rounded-md overflow-hidden">
            <CustomVideoPlayer
              src={message.content}
            />
          </div>
        )}
        {/* Timestamp bottom right */}
        <span className="absolute bottom-1 right-3 text-xs opacity-80">
          {formattedTime}
        </span>
      </div>

      {/* Reactions below the bubble */}
      {message.reactions && message.reactions.length > 0 && (
        <div className={`flex flex-wrap gap-1 mt-1 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
          {Object.entries(reactionsByEmoji).map(([emoji, userIds]) => (
            <Tooltip key={emoji}>
              <TooltipTrigger asChild>
                <Button
                  variant={userReactedEmojis.has(emoji) ? "default" : "secondary"}
                  size="sm"
                  className={`h-6 px-2 text-xs rounded-full shadow ${userReactedEmojis.has(emoji)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/80 hover:bg-muted"
                    }`}
                  onClick={() => handleEmojiSelect(emoji)}
                >
                  {emoji} {userIds.length}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="mb-1 font-semibold text-xs">Reacted by:</div>
                <div className="flex flex-col gap-1">
                  {userIds.map(userId => {
                    const user = users[userId];
                    return (
                      <div key={userId} className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={user?.avatar} alt={user?.name} />
                          <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{user?.name || `User ${userId}`}</span>
                      </div>
                    );
                  })}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      )}

      {/* Reaction picker stays above bubble */}
      {showReactionPicker && (
        <div className={`absolute top-full mt-1 z-50 bg-popover border border-border rounded-md shadow-lg p-2 ${isCurrentUser ? "right-0" : "left-0"
          }`}>
          <div className="flex gap-1 ">
            {reactionEmojis.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-accent"
                onClick={() => handleEmojiSelect(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        className={`flex items-start gap-2 ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        layout
      >
        <ContextMenu>
          <ContextMenuTrigger className="focus:outline-none">
            {messageBubble}
          </ContextMenuTrigger>
          <ContextMenuContent className="bg-background border border-border shadow-lg z-50">
            {onReplyMessage && (
              <ContextMenuItem
                onClick={handleReplyClick}
                className="cursor-pointer hover:bg-accent transition-colors"
              >
                <Reply className="mr-2 h-4 w-4" />
                Reply
              </ContextMenuItem>
            )}

            <ContextMenuItem
              onClick={handleReactClick}
              className="cursor-pointer hover:bg-accent transition-colors"
            >
              <span className="mr-2">😀</span>
              React
            </ContextMenuItem>

            <ContextMenuItem
              onClick={handleCopyClick}
              className="cursor-pointer hover:bg-accent transition-colors"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </ContextMenuItem>

            {isCurrentUser && (
              <>
                <ContextMenuSeparator />
                {onEditMessage && (
                  <ContextMenuItem
                    onClick={handleEditClick}
                    className="cursor-pointer hover:bg-accent transition-colors"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit message
                  </ContextMenuItem>
                )}
                {onDeleteMessage && (
                  <ContextMenuItem
                    onClick={handleDeleteClick}
                    className="cursor-pointer text-destructive focus:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete message
                  </ContextMenuItem>
                )}
              </>
            )}
          </ContextMenuContent>
        </ContextMenu>
      </motion.div>
    </AnimatePresence>
  );
};
