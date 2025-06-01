
import { useState, useEffect } from "react";
import { User, Message } from "@/types";
import { mockUsers, mockMessages } from "@/data/mockData";

export const useChat = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  // Filter messages for the current active chat
  const filteredMessages = messages.filter(
    (message) =>
      activeChat &&
      ((message.senderId === activeChat || message.receiverId === activeChat) ||
        (message.senderId === "current-user" || message.receiverId === "current-user"))
  );

  const handleSendMessage = (content: string, currentUser: User) => {
    if (!activeChat || !content.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: activeChat,
      content: content.trim(),
      timestamp: new Date(),
      type: "text",
      replyToMessageId: replyTo || undefined,
    };

    setMessages((prev) => [...prev, newMessage]);
    setReplyTo(null);
  };

  const handleUserClick = (user: User) => {
    console.log("User clicked in chat:", user.name);
    setActiveChat(user.id);
    setSelectedUser(user);
    setShowUserInfo(false);
  };

  const handleUserAvatarClick = () => {
    setShowUserInfo(true);
  };

  const handleCloseUserInfo = () => {
    setShowUserInfo(false);
  };

  const handleReplyMessage = (message: Message) => {
    setReplyTo(message);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
  };

  const handleReactToMessage = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((message) => {
        if (message.id === messageId) {
          const currentReactions = message.reactions || [];
          const hasReaction = currentReactions.includes(emoji);
          
          return {
            ...message,
            reactions: hasReaction
              ? currentReactions.filter((r) => r !== emoji)
              : [...currentReactions, emoji],
          };
        }
        return message;
      })
    );
  };

  return {
    selectedUser,
    showUserInfo,
    activeChat,
    replyTo,
    messages,
    filteredMessages,
    handleSendMessage,
    handleUserClick,
    handleUserAvatarClick,
    handleCloseUserInfo,
    handleReplyMessage,
    handleCancelReply,
    handleReactToMessage,
    setMessages,
  };
};
