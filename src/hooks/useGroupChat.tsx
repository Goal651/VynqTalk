import { useState, useEffect } from "react"
import { Group, GroupMessage, User } from '@/types';
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { useSocket } from "@/contexts/SocketContext"
import { groupMessageService } from "@/api/services/groupMessages"

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
      setMessages(prevMessages => {
        if (message.sender.id === user?.id) {
          return prevMessages.map(m =>
            m.content === message.content &&
            m.sender.id === message.sender.id
              ? { ...m, id: message.id }
              : m
          );
        }
        const messageExists = prevMessages.some(m => m.id === message.id);
        if (messageExists) {
          return prevMessages;
        }
        return [...prevMessages, message];
      });
    };
    socket.onGroupMessage(handleMessage);
    return () => {
      socket.removeGroupMessageListener(handleMessage);
    };
  }, [user, socket]);

  const handleSendMessage = (content: string, replyData?: GroupMessage) => {
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
      type: "text",
      replyTo: replyData,
      reactions: [],
      isEdited: false,
    }
    setMessages(prevMessages => [...prevMessages, newMessage])
    if (socket) {
      socket.sendGroupMessage(newMessage.content, group, newMessage.type, user)
    }
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
          r => r.emoji === emoji && r.user.id === user.id
        );
        let updatedReactions;
        if (existingReaction) {
          updatedReactions = message.reactions.filter(
            r => !(r.emoji === emoji && r.user.id === user.id)
          );
        } else {
          updatedReactions = [
            ...message.reactions,
            {
              id: Date.now(),
              emoji,
              user: user,
            },
          ];
        }
        if (socket) {
          socket.messageReact(messageId, updatedReactions);
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