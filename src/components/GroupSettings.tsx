import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Camera, Trash2, Plus, X, Search, Settings, Users as UsersIcon } from "lucide-react"
import { Group, User } from '@/types'
import { useToast } from "@/hooks"
import { userService, groupService } from "@/api"
import { useAuth } from "@/contexts/AuthContext"

interface GroupSettingsProps {
  group: Group
  onBack: () => void
  onSave: (group: Group) => void
}

export const GroupSettings = ({ group, onBack, onSave }: GroupSettingsProps) => {
  const { user } = useAuth()
  const { toast } = useToast()
  
  // State management
  const [groupData, setGroupData] = useState({
    name: group.name,
    description: group.description || "",
    avatar: group.avatar,
  })

  const [settings, setSettings] = useState({
    allowMemberInvites: true,
    muteNotifications: false,
    readReceipts: true,
  })

  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [showAddMember, setShowAddMember] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Load all users for member search
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getAllUsers()
        if (response.success && response.data) {
          setUsers(response.data)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive"
        })
      }
    }
    
    fetchUsers()
  }, [toast])

  // Handle group information save
  const handleSave = async () => {
    if (isUpdating) return
    
    setIsUpdating(true)
    try {
      const updatedGroup: Group = {
        ...group,
        name: groupData.name,
        description: groupData.description,
        avatar: groupData.avatar,
      }
      
      // TODO: Add API call to update group
      onSave(updatedGroup)
      
      toast({
        title: "Settings Saved",
        description: "Group settings have been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update group settings",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle setting changes
  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    
    // TODO: Add API call to update group settings
    toast({
      title: "Setting Updated",
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} has been ${value ? 'enabled' : 'disabled'}`,
    })
  }

  // Handle member search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    const filteredResults = users.filter(
      (user) => 
        !group.members.some((member) => member.id === user.id) &&
        (user.name.toLowerCase().includes(query.toLowerCase()) ||
         user.email.toLowerCase().includes(query.toLowerCase()))
    )
    
    setSearchResults(filteredResults)
  }

  // Add member to group
  const handleAddMember = async (selectedUser: User) => {
    if (isUpdating) return
    
    setIsUpdating(true)
    try {
      const response = await groupService.addMember(group.id, selectedUser)
      if (response.success) {
        const updatedGroup = {
          ...group,
          members: [...group.members, selectedUser]
        }
        onSave(updatedGroup)
        setSearchResults([])
        setSearchQuery("")
        setShowAddMember(false)
        
        toast({
          title: "Member Added",
          description: `${selectedUser.name} has been added to the group.`
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add member to the group",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Remove member from group
  const handleRemoveMember = async (memberId: number, memberName: string) => {
    if (isUpdating) return
    
    setIsUpdating(true)
    try {
      const response = await groupService.removeMember(group.id, memberId)
      if (response.success) {
        const updatedGroup = {
          ...group,
          members: group.members.filter((member) => member.id !== memberId)
        }
        onSave(updatedGroup)
        
        toast({
          title: "Member Removed",
          description: `${memberName} has been removed from the group.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove member from the group",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle group avatar change (placeholder)
  const handleChangeAvatar = () => {
    toast({
      title: "Coming Soon",
      description: "Group avatar upload feature is in development",
    })
  }

  // Handle group deletion (placeholder)
  const handleDeleteGroup = () => {
    toast({
      title: "Delete Group",
      description: "Group deletion feature is in development",
      variant: "destructive"
    })
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Group Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your group settings and members</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6 max-w-2xl mx-auto">
          
          {/* Group Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Group Information
              </CardTitle>
              <CardDescription>Update your group's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={groupData.avatar} alt={groupData.name} />
                    <AvatarFallback className="bg-muted">
                      {groupData.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    onClick={handleChangeAvatar}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="groupName">Group Name</Label>
                    <Input
                      id="groupName"
                      value={groupData.name}
                      onChange={(e) => setGroupData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter group name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="groupDescription">Description</Label>
                    <Textarea
                      id="groupDescription"
                      value={groupData.description}
                      onChange={(e) => setGroupData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter group description"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleSave} 
                disabled={isUpdating}
                className="w-full sm:w-auto"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          {/* Group Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Group Settings</CardTitle>
              <CardDescription>Manage your group's preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Allow Member Invites</Label>
                  <p className="text-sm text-muted-foreground">
                    Let members invite others to the group
                  </p>
                </div>
                <Switch
                  checked={settings.allowMemberInvites}
                  onCheckedChange={(checked) => handleSettingChange('allowMemberInvites', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Mute Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Stop receiving notifications from this group
                  </p>
                </div>
                <Switch
                  checked={settings.muteNotifications}
                  onCheckedChange={(checked) => handleSettingChange('muteNotifications', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Read Receipts</Label>
                  <p className="text-sm text-muted-foreground">
                    Show when messages have been read
                  </p>
                </div>
                <Switch
                  checked={settings.readReceipts}
                  onCheckedChange={(checked) => handleSettingChange('readReceipts', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Group Members */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <UsersIcon className="h-5 w-5" />
                    Group Members ({group.members.length})
                  </CardTitle>
                  <CardDescription>Manage your group's members</CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddMember(!showAddMember)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Add Member Section */}
              {showAddMember && (
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg border border-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  
                  {searchResults.length > 0 && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {searchResults.map((searchUser) => (
                        <div
                          key={searchUser.id}
                          className="flex items-center justify-between p-2 hover:bg-accent rounded-md transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={searchUser.avatar} alt={searchUser.name} />
                              <AvatarFallback className="text-xs">
                                {searchUser.name[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{searchUser.name}</p>
                              <p className="text-xs text-muted-foreground">{searchUser.email}</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddMember(searchUser)}
                            disabled={isUpdating}
                          >
                            Add
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {searchQuery && searchResults.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No users found matching "{searchQuery}"
                    </p>
                  )}
                </div>
              )}

              {/* Current Members List */}
              <div className="space-y-2">
                {group.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 hover:bg-accent rounded-md transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    
                    {member.id !== user?.id && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(member.id, member.name)}
                        disabled={isUpdating}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible and destructive actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                <div className="space-y-1">
                  <Label className="text-destructive font-medium">Delete Group</Label>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete this group and all of its content
                  </p>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteGroup}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Group
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </ScrollArea>
    </div>
  )
}
