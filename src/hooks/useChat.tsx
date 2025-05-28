
import { useState, useEffect } from "react";
import { User, Message } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { socketService } from "@/api/services/socket";
import { messageService } from "@/api/services/messages";

export const useChat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [activeChat, setActiveChat] = useState<User | null>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!user || !activeChat) return;
      
      try {
        const response = await messageService.getMessages(String(user.id), String(activeChat.id));
        console.log("Loaded messages:", response);
        if (response.success && response.data) {
          setMessages(response.data);
        }
      } catch (error) {
        console.error("Failed to load messages:", error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive"
        });
      }
    };
    loadMessages();
  }, [activeChat, user, toast]);

  useEffect(() => {
    socketService.connect();
    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleSendMessage = (content: string, replyData?: Message["replyTo"]) => {
    if (!user || !activeChat) {
      toast({
        title: "Error",
        description: "Please select a chat first",
        variant: "destructive"
      });
      return;
    }

    console.log("Sending message:", content, "to user:", activeChat.name, "reply:", replyData);
    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: user.id,
      content: content,
      timestamp: new Date(),
      receiverId: activeChat.id,
      type: "text",
      replyTo: replyData,
      reactions: []
    };
    setMessages([...messages, newMessage]);

    toast({
      title: "Message sent",
      description: `Message sent to ${activeChat.name}`,
    });
    setReplyTo(null);
    socketService.sendMessage(newMessage.content, Number(activeChat.id), Number(user.id));
  };

  const handleUserClick = (clickedUser: User) => {
    console.log("User clicked:", clickedUser.name);
    setActiveChat(clickedUser);
    setShowUserInfo(false);
    setReplyTo(null);

    toast({
      title: "Chat opened",
      description: `Now chatting with ${clickedUser.name}`,
    });
  };

  const handleUserAvatarClick = (clickedUser: User) => {
    console.log("User avatar clicked:", clickedUser.name);
    setSelectedUser(clickedUser);
    setShowUserInfo(true);
  };

  const handleCloseUserInfo = () => {
    console.log("Closing user info");
    setShowUserInfo(false);
  };

  const handleReplyMessage = (message: Message) => {
    console.log("Reply to message requested:", message.id);
    setReplyTo(message);

    toast({
      title: "Replying to message",
      description: "Type your reply below",
    });
  };

  const handleCancelReply = () => {
    console.log("Cancel reply");
    setReplyTo(null);
  };

  const handleReactToMessage = (messageId: string, emoji: string) => {
    console.log("React to message:", messageId, "with emoji:", emoji);

    setMessages(messages.map(message => {
      if (message.id === messageId) {
        const reactions = message.reactions || [];
        const currentUserId = user?.id ?? "current-user";
        const existingReaction = reactions.find(r => r.userId === currentUserId && r.emoji === emoji);

        if (existingReaction) {
          return {
            ...message,
            reactions: reactions.filter(r => r.id !== existingReaction.id)
          };
        } else {
          const newReaction = {
            id: `r${Date.now()}`,
            emoji,
            userId: currentUserId,
            userName: user?.name || "You"
          };
          return {
            ...message,
            reactions: [...reactions, newReaction]
          };
        }
      }
      return message;
    }));

    toast({
      title: "Reaction added",
      description: `Reacted with ${emoji}`,
    });
  };

  const filteredMessages = activeChat
    ? messages.filter(message =>
        (message.senderId === user?.id && message.receiverId === activeChat.id) ||
        (message.senderId === activeChat.id && (!message.receiverId || message.receiverId === user?.id))
      )
    : [];

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
    setMessages
  };
};
