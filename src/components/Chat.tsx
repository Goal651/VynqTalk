
import { useEffect, useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Message, User } from "../types";
import { mockMessages, mockUsers, currentUser } from "../data/mockData";
import { useChat } from "../hooks/useChat"

export const Chat = () => {
  const chat=useChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [users] = useState<User[]>(mockUsers);



  const handleSendMessage = (content: string) => {
    console.log("Sending message:", content);
    const newMessage: Message = {
      id: Date.now(),
      senderId: currentUser.id,
      content: content,
      timestamp: new Date().toISOString(),
      type: "text"
    };
    setMessages([...messages, newMessage]);
  };

  const handleMessageDelete = (messageId: number) => {
    console.log("Deleting message:", messageId);
    setMessages(messages.filter(msg => msg.id !== messageId));
  };

  const handleMessageEdit = (message: Message) => {
    console.log("Editing message:", message.id);
    setMessages(messages.map(msg =>
      msg.id === message.id ? message : msg
    ));
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader users={users} />
      <MessageList
        messages={messages}
        users={users}
        onDeleteMessage={handleMessageDelete}
        onEditMessage={handleMessageEdit}
        currentUserId={currentUser.id}
      />
      <MessageInput onSendMessage={handleSendMessage} currentUser={currentUser} />
    </div>
  );
};
