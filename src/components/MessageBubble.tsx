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
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
      {message.replyToMessage && (
        <div className="text-xs text-muted-foreground mb-1">
          <span className="font-medium">Replying to {message.replyToMessage.sender.name}</span>
          <p className="truncate max-w-[200px]">{message.replyToMessage.content}</p>
        </div>
      )}

      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isCurrentUser
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-foreground"
          }`}
      >
        {!isCurrentUser && (
          <p className="text-xs text-muted-foreground mb-1">User {message.sender.name}</p>
        )}

        <div className="break-words whitespace-pre-wrap ">{message.content}</div>
        <p className="text-xs opacity-70 mt-1">
          {formattedTime}
        </p>
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
