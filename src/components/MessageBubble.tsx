
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
  onReactToMessage?: (messageId: number, emoji: string) => void;
  currentUserId?: number;
}

export const MessageBubble = ({
  message,
  user,
  onUserAvatarClick,
  onDeleteMessage,
  onEditMessage,
  onReplyMessage,
  onReactToMessage,
  currentUserId = 1
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
        <div className={`mb-2 p-2 rounded-md bg-muted/50 border-l-2 border-primary text-sm ${isCurrentUser ? "mr-4" : "ml-4"
          }`}>
          <div className="font-medium text-muted-foreground">
            Replying to {message.replyToMessageId.senderId}
          </div>
          <div className="text-muted-foreground truncate">
            {message.replyToMessageId.content}
          </div>
        </div>
      )}

      <div
        className={`rounded-lg p-3 max-w-[80%] transition-all hover:shadow-md cursor-pointer select-text ${isCurrentUser
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-foreground"
          }`}
      >
        {!isCurrentUser && (
          <div className="font-semibold text-sm mb-1">{user.name}</div>
        )}
        <div className="break-words whitespace-pre-wrap">{message.content}</div>
        <div
          className={`text-xs mt-1 ${isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
            }`}
        >
          {formattedTime}
          {message.edited && (
            <span className="ml-1 italic">(edited)</span>
          )}
        </div>
      </div>

      {message.reactions && message.reactions.length > 0 && (
        <div className={`flex flex-wrap gap-1 mt-1 ${isCurrentUser ? "justify-end mr-4" : "ml-4"}`}>
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
              className="h-6 px-2 text-xs rounded-full bg-muted/80 hover:bg-muted"
              onClick={() => handleEmojiSelect(emoji)}
            >
              {emoji} {reactions.length}
            </Button>
          ))}
        </div>
      )}

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
    <div
      className={`flex items-start gap-2 animate-fade-in ${isCurrentUser ? "flex-row-reverse" : "flex-row"
        }`}
    >
      <Avatar
        className={`cursor-pointer hover:scale-105 transition-transform ${user.isOnline ? "ring-2 ring-green-500 ring-offset-2 ring-offset-background" : ""}`}
        onClick={handleAvatarClick}
      >
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="bg-primary/10 text-primary font-medium ">
          {user.name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

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
    </div>
  );
};
