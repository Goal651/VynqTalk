
import { useState } from "react";
import { User, Message } from "../types";
import { ChatSidebar } from "./ChatSidebar";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { mockMessages, mockUsers, currentUser } from "../data/mockData";
import { UserInfo } from "./UserInfo";

export const ChatView = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [users] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserInfo, setShowUserInfo] = useState(false);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: `m${Date.now()}`,
      userId: currentUser.id,
      content: content,
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setShowUserInfo(true);
  };

  const handleCloseUserInfo = () => {
    setShowUserInfo(false);
  };

  return (
    <div className="flex h-full">
      <ChatSidebar users={users} onUserClick={handleUserClick} />
      <div className="flex-1 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          <MessageList messages={messages} users={users} onUserAvatarClick={handleUserClick} />
        </div>
        <MessageInput onSendMessage={handleSendMessage} currentUser={currentUser} />
      </div>
      {showUserInfo && selectedUser && (
        <UserInfo user={selectedUser} onClose={handleCloseUserInfo} />
      )}
    </div>
  );
};
