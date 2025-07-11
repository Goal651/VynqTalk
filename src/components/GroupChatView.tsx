import { Group } from "@/types/group"
import { User } from "@/types/user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Users, Settings, MessageSquare, Crown, Shield, Phone, Video } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useIsMobile, useGroupChat } from "@/hooks"
import { useState, useMemo } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { GroupMessage, Reaction } from "@/types"
import GroupMessageList from "./GroupMessageList"
import GroupMessageInput from "./GroupMessageInput"
import GroupMediaGallery from "./GroupMediaGallery"
import { GroupMediaGalleryModal } from "./GroupMediaGalleryModal"

interface GroupChatViewProps {
  group: Group
  users: User[]
  onBack: () => void
  onSettings: () => void
  onDeleteMessage?: (messageId: number) => void
  onEditMessage?: (message: GroupMessage) => void
}

export const GroupChatView = ({ 
  group, 
  users, 
  onBack, 
  onSettings,
  onDeleteMessage,
  onEditMessage
}: GroupChatViewProps) => {
  const { user } = useAuth()
  const isMobile = useIsMobile()
  const isAdmin = group.createdBy.id === user?.id
  
  // Use the group chat hook for message handling
  const {
    messages,
    replyTo,
    handleSendMessage,
    handleReplyMessage,
    handleCancelReply,
    handleReactToMessage
  } = useGroupChat(group)
  
  // Wrapper function to convert emoji string to Reaction object
  const handleReactToMessageWrapper = (messageId: number, reaction: Reaction) => {
    handleReactToMessage(messageId, reaction.emoji)
  }

  // Gallery modal state
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)

  // Collect all media messages (images/videos) in the current group
  const mediaMessages = useMemo(
    () => messages.filter(m => m.type === "IMAGE" || m.type === "VIDEO"),
    [messages]
  )

  // Handler to open gallery modal
  const handleMediaClick = (messageId: number) => {
    const idx = mediaMessages.findIndex(m => m.id === messageId)
    if (idx !== -1) {
      setGalleryIndex(idx)
      setGalleryOpen(true)
    }
  }

  // Handler for group actions
  const handleVoiceCall = () => {
    console.log("Voice call initiated for group:", group.id)
  }

  const handleVideoCall = () => {
    console.log("Video call initiated for group:", group.id)
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background to-secondary/10">
      {/* Header */}
      <Card className="border-b rounded-none flex-shrink-0 bg-gradient-to-r from-card/80 via-card to-card/80 backdrop-blur-sm">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {isMobile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onBack}
                  className="cursor-pointer hover:bg-accent/50 transition-colors rounded-full"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              
              <div className="relative">
                <Avatar className="h-12 w-12 ring-2 ring-primary/20 shadow-lg">
                  <AvatarImage src={group.avatar} alt={group.name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-lg font-semibold">
                    {group.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 ring-2 ring-background">
                  <MessageSquare className="h-3 w-3 text-white" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-semibold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                    {group.name}
                  </h2>
                  {isAdmin && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="secondary" className="px-2 py-0.5 bg-primary/10 text-primary hover:bg-primary/20">
                            <Crown className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>You are the group administrator</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1.5" />
                    <span className="font-medium">{users.length}</span>
                    <span className="ml-1">members</span>
                  </div>
                  <div className="h-3 w-px bg-border" />
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Shield className="h-4 w-4 mr-1.5" />
                    <span>{group.isPrivate ? "Private" : "Public"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleVoiceCall}
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Voice call</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleVideoCall}
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                    >
                      <Video className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Video call</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onSettings}
                className="cursor-pointer hover:bg-accent"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Message Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Media Gallery Thumbnails */}
        <GroupMediaGallery
          mediaMessages={mediaMessages}
          onMediaClick={idx => {
            setGalleryIndex(idx);
            setGalleryOpen(true);
          }}
        />
        <ScrollArea className="flex-1">
          <GroupMessageList
            messages={messages}
            users={users}
            currentUserId={user?.id}
            isLoading={false}
            onDeleteMessage={onDeleteMessage}
            onEditMessage={onEditMessage}
            onReplyMessage={handleReplyMessage}
            onReactToMessage={handleReactToMessageWrapper}
            onMediaClick={handleMediaClick}
          />
        </ScrollArea>

        {/* Message Input */}
        <GroupMessageInput
          onSendMessage={handleSendMessage}
          currentUser={user}
          replyTo={replyTo}
          onCancelReply={handleCancelReply}
        />
      </div>

      {/* Media Gallery Modal */}
      {mediaMessages.length > 0 && (
        <GroupMediaGalleryModal
          open={galleryOpen}
          mediaMessages={mediaMessages}
          currentIndex={galleryIndex}
          onClose={() => setGalleryOpen(false)}
          onNavigate={setGalleryIndex}
        />
      )}
    </div>
  )
} 