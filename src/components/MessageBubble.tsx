
import { formatDistanceToNow } from "date-fns";
import { Message, User, Reaction } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator
} from "@/components/ui/context-menu";
import { Edit, Trash2, Reply, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MessageBubbleProps {
  message: Message;
  user: User;
  onUserAvatarClick?: () => void;
  onDeleteMessage?: () => void;
  onEditMessage?: () => void;
  onReplyMessage?: (message: Message) => void;
  onReactToMessage?: (messageId: string, emoji: string) => void;
  currentUserId?: string;
}

export const MessageBubble = ({
  message,
  user,
  onUserAvatarClick,
  onDeleteMessage,
  onEditMessage,
  onReplyMessage,
  onReactToMessage,
  currentUserId = "current-user"
}: MessageBubbleProps) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const isCurrentUser = user.id === currentUserId;
  const formattedTime = formatDistanceToNow(new Date(message.timestamp), {
    addSuffix: true,
  });

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
      onReactToMessage(message.id, emoji);
    }
    setShowReactionPicker(false);
  };

  const reactionEmojis = ["❤️", "😂", "😮", "😢", "😡", "👍", "👎", "🔥"];

  const messageBubble = (
    <div className="relative">
      {message.replyToMessageId && (
        <div className={`mb-2 p-3 rounded-xl bg-muted/30 border-l-4 border-primary/50 text-sm backdrop-blur-sm ${isCurrentUser ? "mr-4" : "ml-4"
          }`}>
          <div className="font-medium text-muted-foreground text-xs mb-1">
            Replying to {message.replyToMessageId.senderId}
          </div>
          <div className="text-muted-foreground/80 truncate">
            {message.replyToMessageId.content}
          </div>
        </div>
      )}

      <div
        className={`rounded-2xl px-4 py-3 max-w-[80%] transition-all duration-200 hover:shadow-lg cursor-pointer select-text backdrop-blur-sm ${isCurrentUser
          ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-br-md"
          : "bg-card/80 text-foreground border border-border/50 shadow-sm rounded-bl-md"
          }`}
      >
        {!isCurrentUser && (
          <div className="font-semibold text-sm mb-2 text-primary">{user.name}</div>
        )}
        <div className="break-words whitespace-pre-wrap leading-relaxed">{message.content}</div>
        <div className="flex items-center justify-between mt-2">
          <div
            className={`text-xs ${isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
              }`}
          >
            {typeof message.timestamp === 'string' ? message.timestamp : new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            {message.edited && (
              <span className="ml-2 italic">(edited)</span>
            )}
          </div>
          {isCurrentUser && (
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-primary-foreground/70 rounded-full"></div>
              <div className="w-1 h-1 bg-primary-foreground/70 rounded-full"></div>
            </div>
          )}
        </div>
      </div>

      {message.reactions && message.reactions.length > 0 && (
        <div className={`flex flex-wrap gap-2 mt-2 ${isCurrentUser ? "justify-end mr-4" : "ml-4"}`}>
          {Object.entries(
            message.reactions.reduce((acc, reaction) => {
              if (!acc[reaction]) {
                acc[reaction] = [];
              }
              acc[reaction].push(reaction);
              return acc;
            }, {} as Record<string, string[]>)
          ).map(([emoji, reactions]) => (
            <Button
              key={emoji}
              variant="secondary"
              size="sm"
              className="h-7 px-3 text-xs rounded-full bg-muted/60 hover:bg-muted/80 border border-border/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
              onClick={() => handleEmojiSelect(emoji)}
            >
              {emoji} <span className="ml-1 font-medium">{reactions.length}</span>
            </Button>
          ))}
        </div>
      )}

      {showReactionPicker && (
        <div className={`absolute top-full mt-2 z-50 bg-card/90 border border-border/50 rounded-xl shadow-xl p-3 backdrop-blur-xl ${isCurrentUser ? "right-0" : "left-0"
          }`}>
          <div className="flex gap-2">
            {reactionEmojis.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0 hover:bg-accent/80 rounded-xl transition-all duration-200 hover:scale-110"
                onClick={() => handleEmojiSelect(emoji)}
              >
                <span className="text-lg">{emoji}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`flex items-end gap-3 animate-fade-in group ${isCurrentUser ? "flex-row-reverse" : "flex-row"
        }`}
    >
      <Avatar
        className={`cursor-pointer transition-all duration-200 group-hover:scale-105 ${user.isOnline ? "ring-2 ring-green-500/50 ring-offset-2 ring-offset-background" : ""}`}
        onClick={handleAvatarClick}
      >
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-medium">
          {user.name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <ContextMenu>
        <ContextMenuTrigger className="focus:outline-none">
          {messageBubble}
        </ContextMenuTrigger>
        <ContextMenuContent className="bg-card/90 border border-border/50 shadow-xl backdrop-blur-xl z-50 rounded-xl">
          {onReplyMessage && (
            <ContextMenuItem
              onClick={handleReplyClick}
              className="cursor-pointer hover:bg-accent/80 transition-colors rounded-lg"
            >
              <Reply className="mr-3 h-4 w-4" />
              Reply
            </ContextMenuItem>
          )}

          <ContextMenuItem
            onClick={handleReactClick}
            className="cursor-pointer hover:bg-accent/80 transition-colors rounded-lg"
          >
            <span className="mr-3 text-sm">😀</span>
            React
          </ContextMenuItem>

          <ContextMenuItem
            onClick={handleCopyClick}
            className="cursor-pointer hover:bg-accent/80 transition-colors rounded-lg"
          >
            <Copy className="mr-3 h-4 w-4" />
            Copy
          </ContextMenuItem>

          {isCurrentUser && (
            <>
              <ContextMenuSeparator />
              {onEditMessage && (
                <ContextMenuItem
                  onClick={handleEditClick}
                  className="cursor-pointer hover:bg-accent/80 transition-colors rounded-lg"
                >
                  <Edit className="mr-3 h-4 w-4" />
                  Edit message
                </ContextMenuItem>
              )}
              {onDeleteMessage && (
                <ContextMenuItem
                  onClick={handleDeleteClick}
                  className="cursor-pointer text-destructive focus:text-destructive hover:bg-destructive/10 transition-colors rounded-lg"
                >
                  <Trash2 className="mr-3 h-4 w-4" />
                  Delete message
                </ContextMenuItem>
              )}
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};
