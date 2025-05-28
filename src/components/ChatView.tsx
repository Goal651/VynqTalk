import { useEffect, useState } from "react"
import { User, Message } from "../types"
import { ChatSidebar } from "./ChatSidebar"
import { MessageList } from "./MessageList"
import { MessageInput } from "./MessageInput"
import { ChatHeader } from "./ChatHeader"
import { mockMessages, mockUsers } from "../data/mockData"
import { UserInfo } from "./UserInfo"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { socketService } from "@/api/services/socket"
import { messageService } from "@/api/services/messages"

interface ChatViewProps {
  onMessageDelete?: (messageId: string) => void
  onMessageEdit?: (message: Message) => void
  users?: User[]
}

export const ChatView = ({ onMessageDelete, onMessageEdit, users }: ChatViewProps) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserInfo, setShowUserInfo] = useState(false)
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null)
  const [messageToEdit, setMessageToEdit] = useState<Message | null>(null)
  const [editedContent, setEditedContent] = useState("")
  const [activeChat, setActiveChat] = useState<User | null>(null)
  const [replyTo, setReplyTo] = useState<Message | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const loadMessages = async () => {
      if (!user || !activeChat) return toast({
        title: "Error",
        description: "Please select a chat first",
        variant: "destructive"
      })
      
      try {
        // Ensure we're passing string IDs to match the updated API signature
        const response = await messageService.getMessages(String(user.id), String(activeChat.id))
        console.log("Loaded messages:", response)
        if (response.success && response.data) {
          setMessages(response.data)
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
    socketService.connect()
    return () => {
      socketService.disconnect()
    }
  }, [])

  const handleSendMessage = (content: string, replyData?: Message["replyTo"]) => {
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
      id: `m${Date.now()}`,
      senderId: user.id,
      content: content,
      timestamp: new Date(),
      receiverId: activeChat.id,
      type: "text",
      replyTo: replyData,
      reactions: []
    }
    setMessages([...messages, newMessage])

    toast({
      title: "Message sent",
      description: `Message sent to ${activeChat.name}`,
    })
    setReplyTo(null)  
    setEditedContent("")
    socketService.sendMessage(newMessage.content, Number(activeChat.id), Number(user.id))
  }

  const handleUserClick = (clickedUser: User) => {
    console.log("User clicked:", clickedUser.name)
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

  const handleDeleteMessage = (messageId: string) => {
    console.log("Delete message requested:", messageId)
    setMessageToDelete(messageId)
  }

  const confirmDeleteMessage = () => {
    if (messageToDelete) {
      console.log("Confirming delete message:", messageToDelete)
      setMessages(messages.filter(message => message.id !== messageToDelete))
      if (onMessageDelete) onMessageDelete(messageToDelete)
      setMessageToDelete(null)

      toast({
        title: "Message deleted",
        description: "Message has been removed",
      })
    }
  }

  const handleEditMessage = (message: Message) => {
    console.log("Edit message requested:", message.id)
    setMessageToEdit(message)
    setEditedContent(message.content)
    if (onMessageEdit) onMessageEdit(message)
  }

  const confirmEditMessage = () => {
    if (messageToEdit) {
      console.log("Confirming edit message:", messageToEdit.id, "new content:", editedContent)
      setMessages(messages.map(message =>
        message.id === messageToEdit.id
          ? { ...message, content: editedContent, edited: true }
          : message
      ))
      setMessageToEdit(null)

      toast({
        title: "Message edited",
        description: "Message has been updated",
      })
    }
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

  const handleReactToMessage = (messageId: string, emoji: string) => {
    console.log("React to message:", messageId, "with emoji:", emoji)

    setMessages(messages.map(message => {
      if (message.id === messageId) {
        const reactions = message.reactions || []
        const currentUserId = user?.id ?? "current-user"
        const existingReaction = reactions.find(r => r.userId === currentUserId && r.emoji === emoji)

        if (existingReaction) {
          return {
            ...message,
            reactions: reactions.filter(r => r.id !== existingReaction.id)
          }
        } else {
          const newReaction = {
            id: `r${Date.now()}`,
            emoji,
            userId: currentUserId,
            userName: user?.name || "You"
          }
          return {
            ...message,
            reactions: [...reactions, newReaction]
          }
        }
      }
      return message
    }))

    toast({
      title: "Reaction added",
      description: `Reacted with ${emoji}`,
    })
  }

  const handleVoiceCall = () => {
    toast({
      title: "Voice call started",
      description: `Calling ${activeChat?.name}...`,
    })
  }

  const handleVideoCall = () => {
    toast({
      title: "Video call started",
      description: `Video calling ${activeChat?.name}...`,
    })
  }

  const filteredMessages = activeChat
    ? messages.filter(message =>
      (message.senderId === user?.id && message.receiverId === activeChat.id) ||
      (message.senderId === activeChat.id && (!message.receiverId || message.receiverId === user?.id))
    )
    : []

  return (
    <div className="flex h-full relative bg-gradient-to-br from-background to-secondary/10">
      <ChatSidebar
        users={users}
        onUserClick={handleUserClick}
        activeChat={activeChat}
      />
      <div className="flex-1 flex flex-col h-full border-l border-r border-border/30 bg-background/90 backdrop-blur-sm relative z-10">
        <ChatHeader
          users={users}
          activeChat={activeChat}
          onVoiceCall={handleVoiceCall}
          onVideoCall={handleVideoCall}
        />

        {activeChat ? (
          <>
            <ScrollArea className="flex-1">
              <MessageList
                messages={filteredMessages}
                users={users || []}
                currentUserId={user?.id}
                onUserAvatarClick={handleUserAvatarClick}
                onDeleteMessage={handleDeleteMessage}
                onEditMessage={handleEditMessage}
                onReplyMessage={handleReplyMessage}
                onReactToMessage={handleReactToMessage}
              />
            </ScrollArea>
            <div className="flex-shrink-0 border-t border-border/30 bg-background/50 backdrop-blur-sm">
              <MessageInput
                onSendMessage={handleSendMessage}
                currentUser={user || { id: "guest", name: "Guest", avatar: "", isOnline: true, isAdmin: false }}
                replyTo={replyTo || undefined}
                onCancelReply={handleCancelReply}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="font-semibold mb-2 text-lg">No conversation selected</h3>
              <p className="text-muted-foreground">Choose a user from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>

      {showUserInfo && selectedUser && (
        <UserInfo user={selectedUser} onClose={handleCloseUserInfo} />
      )}

      <AlertDialog open={messageToDelete !== null} onOpenChange={(open) => !open && setMessageToDelete(null)}>
        <AlertDialogContent className="bg-background border border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              console.log("Delete cancelled")
              setMessageToDelete(null)
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteMessage}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={messageToEdit !== null} onOpenChange={(open) => !open && setMessageToEdit(null)}>
        <DialogContent className="bg-background border border-border">
          <DialogHeader>
            <DialogTitle>Edit message</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editedContent}
            onChange={(e) => {
              console.log("Edit content changed:", e.target.value)
              setEditedContent(e.target.value)
            }}
            className="min-h-[100px] bg-background/50 border-border/50 focus:border-primary/50"
            placeholder="Edit your message..."
          />
          <DialogFooter>
            <Button type="button"
              variant="outline"
              onClick={() => {
                console.log("Edit cancelled")
                setMessageToEdit(null)
              }}
            >
              Cancel
            </Button>
            <Button type="button"
              onClick={confirmEditMessage}
              disabled={!editedContent.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
