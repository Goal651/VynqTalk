
import { formatDistanceToNow } from "date-fns";
import { Message, User } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ContextMenu, 
  ContextMenuContent, 
  ContextMenuItem, 
  ContextMenuTrigger,
  ContextMenuSeparator
} from "@/components/ui/context-menu";
import { Edit, Trash2 } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  user: User;
  onUserAvatarClick?: () => void;
  onDeleteMessage?: () => void;
  onEditMessage?: () => void;
}

export const MessageBubble = ({ 
  message, 
  user, 
  onUserAvatarClick, 
  onDeleteMessage,
  onEditMessage
}: MessageBubbleProps) => {
  const isCurrentUser = user.id === "current-user";
  const formattedTime = formatDistanceToNow(new Date(message.timestamp), {
    addSuffix: true,
  });

  const messageBubble = (
    <div
      className={`rounded-lg p-3 max-w-[80%] transition-all hover:shadow-md ${
        isCurrentUser
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-foreground"
      }`}
    >
      {!isCurrentUser && (
        <div className="font-semibold text-sm mb-1">{user.name}</div>
      )}
      <div className="break-words">{message.content}</div>
      <div
        className={`text-xs mt-1 ${
          isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
        }`}
      >
        {formattedTime}
      </div>
    </div>
  );

  return (
    <div
      className={`flex items-start gap-2 animate-fade-in ${
        isCurrentUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <Avatar 
        className={`cursor-pointer hover-scale ${user.isOnline ? "ring-2 ring-green-500 ring-offset-2 ring-offset-background" : ""}`}
        onClick={onUserAvatarClick}
      >
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      
      {isCurrentUser ? (
        <ContextMenu>
          <ContextMenuTrigger>{messageBubble}</ContextMenuTrigger>
          <ContextMenuContent>
            {onEditMessage && (
              <ContextMenuItem onClick={onEditMessage} className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Edit message
              </ContextMenuItem>
            )}
            {onDeleteMessage && (
              <>
                <ContextMenuSeparator />
                <ContextMenuItem 
                  onClick={onDeleteMessage} 
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete message
                </ContextMenuItem>
              </>
            )}
          </ContextMenuContent>
        </ContextMenu>
      ) : (
        messageBubble
      )}
    </div>
  );
};
