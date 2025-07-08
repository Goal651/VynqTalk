import { useState, useEffect } from "react"
import { User, Message, Reaction, MessageType, SendMessageRequest, ChatReaction } from '@/types'
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks"
import { useSocket } from "@/contexts/SocketContext"
import { messageService } from "@/api"

// Utility to deduplicate reactions: only one per userId+emoji, ignore invalid userIds
function deduplicateReactions(reactions: { userId: number | string | null, emoji: string }[]): { userId: number, emoji: string }[] {
  const seen = new Set()
  return reactions
    .map(r => ({
      userId: typeof r.userId === "string" ? Number(r.userId) : r.userId,
      emoji: r.emoji
    }))
    .filter(r => {
      if (!r.userId || typeof r.userId !== "number" || isNaN(r.userId)) return false
      const key = `${r.userId}-${r.emoji}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
}


export const useChat = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const socket = useSocket()
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserInfo, setShowUserInfo] = useState(false)
  const [activeChat, setActiveChat] = useState<User | null>(null)
  const [replyTo, setReplyTo] = useState<Message | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const loadMessages = async () => {
      if (!user || !activeChat) return

      try {
        const response = await messageService.getMessages(String(user.id), String(activeChat.id))
        if (response.success && response.data) {
          setMessages(response.data)
          console.log("Loaded messages:", response.data)
        }
      } catch (error) {
        console.error("Failed to load messages:", error)
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive"
        })
      }
    }
    loadMessages()
  }, [activeChat, user, toast])

  useEffect(() => {
    if (!socket) return
    const handleMessage = (message: Message) => {
      console.log("Received new message:", message)
      setMessages(prevMessages => {
        if (message.sender.id === user?.id) {
          return prevMessages.map(m =>
            m.content === message.content &&
              m.sender.id === message.sender.id &&
              m.receiver.id === message.receiver.id
              ? { ...m, id: message.id }
              : m
          )
        }
        const messageExists = prevMessages.some(m => m.id === message.id)
        if (messageExists) {
          return prevMessages
        }
        return [...prevMessages, message]
      })
      if (message.sender.id === user?.id) return
      // Smart notification logic
      if (!activeChat || ((message.sender.id !== activeChat.id)) && message.sender.id !== user?.id) {
        // Not the active chat: show browser notification
        if (window.Notification && Notification.permission === 'granted') {
          new Notification(message.sender.name || 'New Message ', {
            body: message.content,
            icon: message.sender.avatar || '/logo.svg',
            tag: `chat-from-${message.sender.id}`,
          })
        }
      } else {
        // Active chat: show toast
        toast({
          title: `New message from ${message.sender.name}`,
          description: message.content,

        })
      }
    }

    const handleReaction = (message: Message) => {
      console.log("Received reaction:", message)
      // Deduplicate reactions before updating state
      const cleanedReactions = deduplicateReactions(message.reactions || [])
      setMessages(prevMessages =>
        prevMessages.map(m =>
          m.id === message.id
            ? { ...m, reactions: cleanedReactions }
            : m
        )
      )
    }

    socket.onMessage(handleMessage)
    socket.onReaction(handleReaction)
    // No need to call socket.connect/disconnect, context handles it
    return () => {
      socket.removeMessageListener(handleMessage)
      socket.removeReactionListener(handleReaction)
    }
  }, [user, socket, activeChat])

  const handleSendMessage = (content: string, type: MessageType, fileName: string | null, replyData?: Message) => {
    if (!user || !activeChat) {
      toast({
        title: "Error",
        description: "Please select a chat first",
        variant: "destructive"
      })
      return
    }

    console.log("Sending message:", content, "to user:", activeChat.name, "reply:", replyData)

    const newMessage: Message = {
      id: Date.now(),
      sender: user,
      content: content,
      timestamp: new Date().toISOString(),
      receiver: activeChat,
      type,
      replyTo,
      reactions: [],
      fileName: fileName
    }

    const payload: SendMessageRequest = {
      content: newMessage.content,
      senderId: newMessage.sender.id,
      receiverId: newMessage.receiver.id,
      type: newMessage.type,
    }

    setMessages(prevMessages => [...prevMessages, newMessage])

    if (socket) {
      if (replyData) {
        socket.messageReply(payload)
      } else {
        socket.sendMessage(payload)
      }
    }

    toast({
      title: "Message sent",
      description: `Message sent to ${activeChat.name}`,
    })
    setReplyTo(null)
  }

  const handleUserClick = (clickedUser: User) => {
    setActiveChat(clickedUser)
    setShowUserInfo(false)
    setReplyTo(null)
    console.log("testing notification user", clickedUser)
    toast({
      title: "Chat opened",
      description: `Now chatting with ${clickedUser.name}`,
    })
  }

  const handleUserAvatarClick = (clickedUser: User) => {
    console.log("User avatar clicked:", clickedUser.name)
    setSelectedUser(clickedUser)
    setShowUserInfo(true)
  }

  const handleCloseUserInfo = () => {
    console.log("Closing user info")
    setShowUserInfo(false)
  }

  const handleReplyMessage = (message: Message) => {
    console.log("Reply to message requested:", message.id)
    setReplyTo(message)

    toast({
      title: "Replying to message",
      description: "Type your reply below",
    })
  }

  const handleCancelReply = () => {
    console.log("Cancel reply")
    setReplyTo(null)
  }

  const handleReactToMessage = (messageId: number, reaction: Reaction) => {
    setMessages(prevMessages => {
      let hasExistingReaction = false
      const updatedMessages = prevMessages.map(message => {
        if (message.id === messageId) {
          const reactions = message.reactions || []
          const existingReaction = reactions.find(r => r.emoji === reaction.emoji && r.userId === reaction.userId)

          let updatedReactions: Reaction[]
          if (existingReaction) {
            updatedReactions = reactions.filter(r => !(r.emoji === reaction.emoji && r.userId === reaction.userId))
            hasExistingReaction = true
          } else {
            updatedReactions = [...reactions, { userId: reaction.userId, emoji: reaction.emoji }]
            hasExistingReaction = false
          }

          const updatedMessage = { ...message, reactions: updatedReactions }
          const payload: ChatReaction = { messageId, reactions: updatedReactions }
          if (socket) socket.messageReact(payload)
          return updatedMessage
        }
        return message
      })
      toast({
        title: hasExistingReaction ? "Reaction removed" : "Reaction added",
        description: hasExistingReaction ? `Removed ${reaction.emoji}` : `Reacted with ${reaction.emoji}`,
      })
      return updatedMessages
    })
  }

  const filteredMessages = activeChat
    ? messages.filter(message =>
      (message.sender.id === user?.id && message.receiver.id === activeChat.id) ||
      (message.sender.id === activeChat.id && message.receiver.id === user?.id)
    )
    : []

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
  }
}
