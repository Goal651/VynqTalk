
import { Message, User } from "../types";
import { formatDistanceToNow } from "date-fns";

interface MessageBubbleProps {
  message: Message;
  user: User;
}

export const MessageBubble = ({ message, user }: MessageBubbleProps) => {
  return (
    <div className="flex items-start space-x-3 animate-fade-in">
      <div className="relative flex-shrink-0">
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-10 h-10 rounded-full"
        />
        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-background rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></span>
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-sm">{user.name}</span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
          </span>
        </div>
        <div className="mt-1 p-3 bg-secondary rounded-lg text-sm">
          {message.content}
        </div>
      </div>
    </div>
  );
};
