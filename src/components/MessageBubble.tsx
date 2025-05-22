
import { formatDistanceToNow } from "date-fns";
import { Message, User } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageBubbleProps {
  message: Message;
  user: User;
  onUserAvatarClick?: () => void;
}

export const MessageBubble = ({ message, user, onUserAvatarClick }: MessageBubbleProps) => {
  const isCurrentUser = user.id === "current-user";
  const formattedTime = formatDistanceToNow(new Date(message.timestamp), {
    addSuffix: true,
  });

  return (
    <div
      className={`flex items-start gap-2 ${
        isCurrentUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <Avatar 
        className={`cursor-pointer ${user.isOnline ? "ring-2 ring-green-500" : ""}`}
        onClick={onUserAvatarClick}
      >
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div
        className={`rounded-lg p-3 max-w-[80%] ${
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
    </div>
  );
};
