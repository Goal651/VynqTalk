import { formatDistanceToNow } from "date-fns";
import { Message, User, Reaction } from '@/types';
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
import { useUsers } from "@/contexts/UsersContext";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface MessageBubbleProps {
  message: Message;
  user: User;
  onUserAvatarClick?: () => void;
  onDeleteMessage?: () => void;
  onEditMessage?: () => void;
  onReplyMessage?: (message: Message) => void;
  onReactToMessage?: (messageId: number, reaction: Reaction) => void;
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
  currentUserId 
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
      const newReaction:Reaction={
        userId:currentUserId,
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
        <div className="flex items-center mb-2">
          <div className="border-l-4 border-primary bg-muted/60 px-3 py-1 rounded-md w-full">
            <span className="block text-xs font-semibold text-primary mb-0.5">
              Replying to {message.replyTo.sender.name}
            </span>
            <span className="block text-xs text-muted-foreground truncate max-w-[200px]">
              {message.replyTo.content}
            </span>
          </div>
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
          {Object.entries(reactionsByEmoji).map(([emoji, userIds]) => (
            <Tooltip key={emoji}>
              <TooltipTrigger asChild>
                <Button
                  variant={userReactedEmojis.has(emoji) ? "default" : "secondary"}
                  size="sm"
                  className={`h-6 px-2 text-xs rounded-full ${
                    userReactedEmojis.has(emoji)
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
