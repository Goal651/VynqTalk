import { useEffect, useRef } from "react";
import { Message, Reaction } from "@/types/message";
import { User } from "@/types/user";
import { MessageBubble } from "./MessageBubble";
import { format, isToday, isYesterday } from "date-fns";

interface MessageListProps {
  messages: Message[];
  users: User[];
  onUserAvatarClick?: (user: User) => void;
  onDeleteMessage?: (messageId: number) => void;
  onEditMessage?: (message: Message) => void;
  onReplyMessage?: (message: Message) => void;
  onReactToMessage?: (messageId: number, reaction:Reaction) => void;
  currentUserId?: number;
  onMediaClick?: (messageId: number) => void;
}

export const MessageList = ({
  messages,
  users,
  onUserAvatarClick,
  onDeleteMessage,
  onEditMessage,
  onReplyMessage,
  onReactToMessage,
  currentUserId = 1,
  onMediaClick
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("MessageList messages:", messages);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Group messages by day
  const grouped = messages.reduce((acc, msg) => {
    const date = new Date(msg.timestamp);
    const key = date.toDateString();
    if (!acc[key]) acc[key] = [];
    acc[key].push(msg);
    return acc;
  }, {} as Record<string, Message[]>);
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  function getSectionLabel(dateStr: string) {
    const date = new Date(dateStr);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "EEEE, MMM d");
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background/80 to-background">
      {sortedDates.map(dateStr => (
        <div key={dateStr}>
          <div className="flex justify-center mb-6 mt-2">
            <span className="inline-block bg-secondary/80 text-xs text-muted-foreground px-4 py-1 rounded-full shadow-sm">
              {getSectionLabel(dateStr)}
            </span>
          </div>
          <div className="space-y-6">
            {grouped[dateStr].map((message) => {
              const user = users.find((u) => u.id == message.sender.id);
              return user ? (
                <MessageBubble
                  key={message.id}
                  message={message}
                  user={user}
                  currentUserId={currentUserId}
                  onUserAvatarClick={onUserAvatarClick ? () => onUserAvatarClick(user) : undefined}
                  onDeleteMessage={onDeleteMessage ? () => onDeleteMessage(message.id) : undefined}
                  onEditMessage={onEditMessage ? () => onEditMessage(message) : undefined}
                  onReplyMessage={onReplyMessage}
                  onReactToMessage={onReactToMessage}
                  onMediaClick={onMediaClick}
                />
              ) : null;
            })}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
