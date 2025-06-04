import { useState, useEffect } from "react"
import { Group, GroupMessage, User } from "@/types"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { socketService } from "@/api/services/socket"
import { groupMessageService } from "@/api/services/groupMessages"

export const useGroupChat = (group: Group) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [messages, setMessages] = useState<GroupMessage[]>([])
  const [replyTo, setReplyTo] = useState<GroupMessage | null>(null)

  useEffect(() => {
    const loadMessages = async () => {
      if (!user || !group) return

      try {
        const response = await groupMessageService.getMessages(group.id)
        if (response.success && response.data) {
          setMessages(response.data)
          console.log("Loaded group messages:", response.data)
        }
      } catch (error) {
        console.error("Failed to load group messages:", error)
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
    const handleMessage = (message: GroupMessage) => {
      console.log("Received new group message:", message)
      
      setMessages(prevMessages => {
        if (message.sender.id === user?.id) {
          return prevMessages.map(m => 
            m.content === message.content && 
            m.sender.id === message.sender.id
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

    socketService.onGroupMessage(handleMessage)
    socketService.connect()

    return () => {
      socketService.disconnect()
      socketService.removeGroupMessageListener(handleMessage)
    }
  }, [user])

  const handleSendMessage = (content: string, replyData?: GroupMessage) => {
    if (!user || !group) {
      toast({
        title: "Error",
        description: "Please select a group first",
        variant: "destructive"
      })
      return
    }

    console.log("Sending group message:", content, "to group:", group.name, "reply:", replyData)
    
    const newMessage: GroupMessage = {
      id: Date.now(),
      sender: user,
      group: group,
      content: content,
      timestamp: new Date().toISOString(),
      type: "text",
      replyToMessage: replyData,
      reactions: []
    }

    setMessages(prevMessages => [...prevMessages, newMessage])

    socketService.sendGroupMessage(newMessage.content, group.id, newMessage.type, user)

    toast({
      title: "Message sent",
      description: `Message sent to ${group.name}`,
    })
    setReplyTo(null)
  }

  const handleReplyMessage = (message: GroupMessage) => {
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