import { useState, useEffect } from "react"
import { User, Message } from "@/types"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { socketService } from "@/api/services/socket"
import { messageService } from "@/api/services/messages"

export const useChat = () => {
  const { user } = useAuth()
  const { toast } = useToast()
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
    }

    const handleReaction = (message: Message) => {
      console.log("Received reaction:", message)
      setMessages(prevMessages => 
        prevMessages.map(m => 
          m.id === message.id 
            ? { ...m, reactions: message.reactions }
            : m
        )
      )
    }

    socketService.onMessage(handleMessage)
    socketService.onReaction(handleReaction)
    socketService.connect()

    return () => {
      socketService.disconnect()
      socketService.removeMessageListener(handleMessage)
      socketService.removeReactionListener(handleReaction)
    }
  }, [user])

  const handleSendMessage = (content: string, replyData?: Message) => {
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
      type: "text",
      replyToMessage: replyData,
      reactions: []
    }

    setMessages(prevMessages => [...prevMessages, newMessage])

    if (replyData) {
      socketService.messageReply(newMessage.content,activeChat, newMessage.type, user, replyData)
    } else {
      socketService.sendMessage(newMessage.content, activeChat, newMessage.type, user)
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

  const handleReactToMessage = (messageId: number, emoji: string) => {
    console.log("React to message:", messageId, "with emoji:", emoji)

    setMessages(prevMessages => {
      let hasExistingReaction = false
      
      const updatedMessages = prevMessages.map(message => {
        if (message.id === messageId) {
          const reactions = message.reactions || []
          const existingReaction = reactions.find(r => r === emoji)
          hasExistingReaction = !!existingReaction

          let updatedReactions: string[]
          if (existingReaction) {
            updatedReactions = reactions.filter(r => r !== emoji)
          } else {
            updatedReactions = [...reactions, emoji]
          }

          const updatedMessage = {
            ...message,
            reactions: updatedReactions
          }

          socketService.messageReact(messageId, updatedReactions)
          
          return updatedMessage
        }
        return message
      })

      toast({
        title: hasExistingReaction ? "Reaction removed" : "Reaction added",
        description: hasExistingReaction ? `Removed ${emoji}` : `Reacted with ${emoji}`,
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
