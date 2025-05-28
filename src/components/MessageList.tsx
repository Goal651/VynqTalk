
import { useEffect, useRef } from "react";
import { Message, User } from "../types";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  users: User[];
  onUserAvatarClick?: (user: User) => void;
  onDeleteMessage?: (messageId: string) => void;
  onEditMessage?: (message: Message) => void;
  onReplyMessage?: (message: Message) => void;
  onReactToMessage?: (messageId: string, emoji: string) => void;
  currentUserId?: string;
}

export const MessageList = ({
  messages,
  users,
  onUserAvatarClick,
  onDeleteMessage,
  onEditMessage,
  onReplyMessage,
  onReactToMessage,
  currentUserId = "u1"
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("MessageList messages:", messages);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background/80 to-background">
      {messages.map((message) => {
        const user = users.find((u) => u.id === message.senderId);
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
          />
        ) : null;
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};
