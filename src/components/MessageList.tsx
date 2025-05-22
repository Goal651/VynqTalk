
import { useEffect, useRef } from "react";
import { Message, User } from "../types";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  users: User[];
}

export const MessageList = ({ messages, users }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const user = users.find((u) => u.id === message.userId);
        return user ? <MessageBubble key={message.id} message={message} user={user} /> : null;
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};
