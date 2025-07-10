import { useState, useEffect } from "react"
import { ChatReaction, Group, GroupMessage, MessageType, SendGroupMessageRequest, User } from '@/types';
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks"
import { useSocket } from "@/contexts/SocketContext"
import { groupMessageService } from "@/api"

// Utility to deduplicate reactions: only one per userId+emoji, ignore invalid userIds
function deduplicateReactions(reactions: { userId: number | string | null, emoji: string }[]): { userId: number, emoji: string }[] {
  const seen = new Set();
  return reactions
    .map(r => ({
      userId: typeof r.userId === "string" ? Number(r.userId) : r.userId,
      emoji: r.emoji
    }))
    .filter(r => {
      if (!r.userId || typeof r.userId !== "number" || isNaN(r.userId)) return false;
      const key = `${r.userId}-${r.emoji}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export const useGroupChat = (group: Group) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const socket = useSocket();
  const [messages, setMessages] = useState<GroupMessage[]>([])
  const [replyTo, setReplyTo] = useState<GroupMessage | null>(null)

  useEffect(() => {
    const loadMessages = async () => {
      if (!user || !group) return

      try {
        const response = await groupMessageService.getMessages(group.id)
        if (response.success && response.data) {
          setMessages(response.data)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load group messages",
          variant: "destructive"
        })
      }
    }
    loadMessages()
  }, [group, user, toast])

  useEffect(() => {
    if (!socket) return;
    const handleMessage = (message: GroupMessage) => {
      // Deduplicate reactions before updating state
      const cleanedReactions = deduplicateReactions(message.reactions || []);
      setMessages(prevMessages => {
        if (message.sender.id === user?.id) {
          return prevMessages.map(m =>
            m.content === message.content &&
              m.sender.id === message.sender.id
              ? { ...m, id: message.id, reactions: cleanedReactions }
              : m
          );
        }
        const messageExists = prevMessages.some(m => m.id === message.id);
        if (messageExists) {
          return prevMessages.map(m =>
            m.id === message.id ? { ...m, reactions: cleanedReactions } : m
          );
        }
        return [...prevMessages, { ...message, reactions: cleanedReactions }];
      });
    };
    socket.onGroupMessage(handleMessage);
    return () => {
      socket.removeGroupMessageListener(handleMessage);
    };
  }, [user, socket]);

  const handleSendMessage = (content: string, type: MessageType, fileName: string | null = null, replyData?: GroupMessage) => {
    if (!user || !group) {
      toast({
        title: "Error",
        description: "Please select a group first",
        variant: "destructive"
      })
      return
    }
    const newMessage: GroupMessage = {
      id: Date.now(),
      sender: user,
      group: group,
      content: content,
      timestamp: new Date().toISOString(),
      type: type ,
      fileName: fileName,
      replyTo: replyData,
      reactions: [],
      isEdited: false,
    }
    const payload: SendGroupMessageRequest = {
      content: newMessage.content,
      senderId: newMessage.sender.id,
      groupId: newMessage.group.id,
      type: newMessage.type,
      replyToId: replyData?.id
    }
    setMessages(prevMessages => [...prevMessages, newMessage])
    if (socket) socket.sendGroupMessage(payload)

    toast({
      title: "Message sent",
      description: `Message sent to ${group.name}`,
    })
    setReplyTo(null)
  }

  const handleReplyMessage = (message: GroupMessage) => {
    setReplyTo(message)
    toast({
      title: "Replying to message",
      description: "Type your reply below",
    })
  }

  const handleCancelReply = () => {
    setReplyTo(null)
  }

  const handleReactToMessage = (messageId: number, emoji: string) => {
    if (!user) return;
    setMessages(prevMessages => {
      return prevMessages.map(message => {
        if (message.id !== messageId) return message;
        const existingReaction = message.reactions.find(
          r => r.emoji === emoji && r.userId === user.id
        );
        let updatedReactions;
        if (existingReaction) {
          updatedReactions = message.reactions.filter(
            r => !(r.emoji === emoji && r.userId === user.id)
          );
        } else {
          updatedReactions = [
            ...message.reactions,
            { userId: user.id, emoji }
          ];
        }

        const payload: ChatReaction = {
          messageId,
          reactions: updatedReactions
        }
        if (socket) {
          socket.messageReact(payload);
        }
        return { ...message, reactions: updatedReactions };
      });
    });
    toast({
      title: "Reaction updated",
      description: `You reacted with ${emoji}`,
    });
  }

  return {
    messages,
    replyTo,
    handleSendMessage,
    handleReplyMessage,
    handleCancelReply,
    handleReactToMessage,
    setMessages
  }
} 