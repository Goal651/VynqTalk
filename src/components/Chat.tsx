
import { useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Message, User } from "../types";
import { mockMessages, mockUsers, currentUser } from "../data/mockData";

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [users] = useState<User[]>(mockUsers);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: `m${Date.now()}`,
      userId: currentUser.id,
      content: content,
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader users={users} />
      <MessageList messages={messages} users={users} />
      <MessageInput onSendMessage={handleSendMessage} currentUser={currentUser} />
    </div>
  );
};
