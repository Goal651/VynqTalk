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
import { Send, Smile, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { EmojiPicker } from "@/components/EmojiPicker"

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
        className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}
      >
        {!isCurrentUser && (
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={senderAvatar} alt={senderName} />
            <AvatarFallback>{senderName[0]}</AvatarFallback>
          </Avatar>
        )}
        <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
          {!isCurrentUser && (
            <span className="text-sm text-gray-500 mb-1">{senderName}</span>
          )}
          <div
            className={`rounded-lg px-4 py-2 max-w-[70%] ${
              isCurrentUser
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            {message.replyToMessage && (
              <div className="text-xs opacity-70 mb-1 border-l-2 pl-2 border-current">
                Replying to {getSenderName(message.replyToMessage.sender.id)}:{" "}
                {message.replyToMessage.content}
              </div>
            )}
            <p>{message.content}</p>
            <div className="flex items-center gap-1 mt-1">
              {message.reactions?.map((reaction, index) => (
                <span
                  key={index}
                  className="text-xs cursor-pointer hover:bg-muted/50 rounded px-1"
                  onClick={() => handleReactToMessage(message.id, reaction)}
                >
                  {reaction}
                </span>
              ))}
            </div>
          </div>
          <span className="text-xs text-gray-500 mt-1">
            {format(new Date(message.timestamp), "HH:mm")}
          </span>
        </div>
        {isCurrentUser && (
          <Avatar className="h-8 w-8 ml-2">
            <AvatarImage src={senderAvatar} alt={senderName} />
            <AvatarFallback>{senderName[0]}</AvatarFallback>
          </Avatar>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ScrollArea ref={scrollRef} className="h-full p-4">
          {messages.map(renderMessage)}
        </ScrollArea>
      </div>

      {replyTo && (
        <div className="px-4 py-2 bg-muted/50 flex items-center justify-between">
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

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10"
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
            className="flex-1"
          />
          <Button type="submit" size="icon" className="h-10 w-10">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  )
}
