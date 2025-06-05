import { useState, useRef, useEffect } from "react"
import { Group, GroupMessage, User } from "@/types"
import { useGroupChat } from "@/hooks/useGroupChat"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { Send, Smile, X, Reply, MoreVertical } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { EmojiPicker } from "@/components/EmojiPicker"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface GroupChatProps {
  group: Group
  users: User[]
}

export const GroupChat = ({ group, users }: GroupChatProps) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [message, setMessage] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const {
    messages,
    replyTo,
    handleSendMessage,
    handleReplyMessage,
    handleCancelReply,
    handleReactToMessage
  } = useGroupChat(group)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    handleSendMessage(message, replyTo || undefined)
    setMessage("")
  }

  const getSenderName = (senderId: number) => {
    const sender = users.find(u => u.id === senderId)
    return sender ? sender.name : "Unknown User"
  }

  const getSenderAvatar = (senderId: number) => {
    const sender = users.find(u => u.id === senderId)
    return sender?.avatar || ""
  }

  const renderMessage = (message: GroupMessage) => {
    const isCurrentUser = message.sender.id === user?.id
    const senderName = getSenderName(message.sender.id)
    const senderAvatar = getSenderAvatar(message.sender.id)

    return (
      <div
        key={message.id}
        className={cn(
          "flex mb-4 group",
          isCurrentUser ? "justify-end" : "justify-start"
        )}
      >
        {!isCurrentUser && (
          <Avatar className="h-8 w-8 mr-2 ring-2 ring-primary/10">
            <AvatarImage src={senderAvatar} alt={senderName} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20">
              {senderName[0]}
            </AvatarFallback>
          </Avatar>
        )}
        <div className={cn(
          "flex flex-col max-w-[70%]",
          isCurrentUser ? "items-end" : "items-start"
        )}>
          {!isCurrentUser && (
            <span className="text-sm font-medium text-muted-foreground mb-1">
              {senderName}
            </span>
          )}
          <div className="relative group/message">
            <div
              className={cn(
                "rounded-2xl px-4 py-2 shadow-sm",
                isCurrentUser
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              {message.replyToMessage && (
                <div className="text-xs opacity-70 mb-1 border-l-2 pl-2 border-current">
                  Replying to {getSenderName(message.replyToMessage.sender.id)}:{" "}
                  {message.replyToMessage.content}
                </div>
              )}
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
              {message.reactions && message.reactions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {message.reactions.map((reaction, index) => (
                    <span
                      key={index}
                      className="text-xs cursor-pointer hover:bg-muted/50 rounded px-1 transition-colors"
                      onClick={() => handleReactToMessage(message.id, reaction)}
                    >
                      {reaction}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className={cn(
              "absolute top-0 opacity-0 group-hover/message:opacity-100 transition-opacity",
              isCurrentUser ? "-left-12" : "-right-12"
            )}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isCurrentUser ? "end" : "start"}>
                  <DropdownMenuItem onClick={() => handleReplyMessage(message)}>
                    <Reply className="h-4 w-4 mr-2" />
                    Reply
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <span className="text-xs text-muted-foreground mt-1">
            {format(new Date(message.timestamp), "HH:mm")}
          </span>
        </div>
        {isCurrentUser && (
          <Avatar className="h-8 w-8 ml-2 ring-2 ring-primary/10">
            <AvatarImage src={senderAvatar} alt={senderName} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20">
              {senderName[0]}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background to-secondary/5">
      <div className="flex-1 overflow-hidden">
        <ScrollArea ref={scrollRef} className="h-full p-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="font-semibold mb-2 text-lg">No messages yet</h3>
                <p className="text-muted-foreground">Start the conversation by sending a message</p>
              </div>
            </div>
          ) : (
            messages.map(renderMessage)
          )}
        </ScrollArea>
      </div>

      {replyTo && (
        <div className="px-4 py-2 bg-muted/50 flex items-center justify-between border-t">
          <div className="text-sm">
            Replying to {getSenderName(replyTo.sender.id)}: {replyTo.content}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancelReply}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 border-t bg-background/50 backdrop-blur-sm">
        <div className="flex gap-2">
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 hover:bg-muted"
              >
                <Smile className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <EmojiPicker onEmojiSelect={(emoji) => {
                setMessage(prev => prev + emoji)
                setShowEmojiPicker(false)
              }} />
            </PopoverContent>
          </Popover>

          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-background/50"
          />
          <Button 
            type="submit" 
            size="icon" 
            className="h-10 w-10 bg-primary hover:bg-primary/90"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  )
}
