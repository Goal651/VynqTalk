import { Group, User } from "@/types"
import { GroupChat } from "./GroupChat"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Users, Settings, MessageSquare, Crown, Shield } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface GroupChatViewProps {
  group: Group
  users: User[]
  onBack: () => void
  onSettings: () => void
}

export const GroupChatView = ({ group, users, onBack, onSettings }: GroupChatViewProps) => {
  const { user } = useAuth()
  const isAdmin = group.createdBy.id === user?.id

  return (
    <div className="flex flex-col h-full">
      <Card className="border-b rounded-none flex-shrink-0 bg-gradient-to-r from-card/80 via-card to-card/80 backdrop-blur-sm">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="cursor-pointer hover:bg-accent/50 transition-colors rounded-full"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
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
                      size="sm"
                      onClick={onSettings}
                      className="cursor-pointer hover:bg-accent/50 transition-colors rounded-full px-3"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Group settings</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex-1 overflow-hidden">
        <GroupChat group={group} users={users} />
      </div>
    </div>
  )
} 