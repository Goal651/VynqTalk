import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Camera, UserPlus, UserMinus, Crown, Shield, Trash2, Plus, X, Search } from "lucide-react"
import { Group } from "@/types/group"
import { User } from "@/types/user"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { userService } from "@/api/services/users"
import { groupService } from "@/api/services/groups"
import { useAuth } from "@/contexts/AuthContext"
import { GroupChat } from "./GroupChat"

interface GroupSettingsProps {
  group: Group
  onBack: () => void
  onSave: (group: Group) => void
}

export const GroupSettings = ({ group, onBack, onSave }: GroupSettingsProps) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [groupData, setGroupData] = useState({
    name: group.name,
    description: group.description || "",
    avatar: group.avatar,
  })

  const [settings, setSettings] = useState({
    allowMemberInvites: true,
    muteNotifications: false,
    readReceipts: true,
    messageHistory: true,
  })

  const [showAddMember, setShowAddMember] = useState(false)
  const [newMember, setNewMember] = useState<User | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [suggestions, setSuggestions] = useState<User[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"chat" | "settings">("settings")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userService.getAllUsers()
        setUsers(res.data);
      } catch (err) {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    };
    fetchUsers();
  }, []);

  const handleSave = () => {
    console.log("Saving group settings:", groupData)
    const updatedGroup: Group = {
      ...group,
      name: groupData.name,
      description: groupData.description,
      avatar: groupData.avatar,
    }
    onSave(updatedGroup)

    toast({
      title: "Settings saved",
      description: "Group settings have been updated successfully",
    })
  }

  const handleSettingChange = (key: string, value: boolean) => {
    console.log(`Setting ${key} changed to:`, value)
    setSettings(prev => ({ ...prev, [key]: value }))

    toast({
      title: "Setting updated",
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} has been ${value ? 'enabled' : 'disabled'}`,
    })
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const filteredResults = users.filter(
      (user) => 
        !group.members.some((member) => member.id === user.id) &&
        (user.name.toLowerCase().includes(query.toLowerCase()) ||
         user.email.toLowerCase().includes(query.toLowerCase()))
    );
    setSearchResults(filteredResults);
  };

  const handleUpdateMember = async (user: User) => {
    try {
      const res = await groupService.addMember(group.id, user)
      if (res.success) {
        const updatedGroup = {
          ...group,
          members: [...group.members, user]
        }
        onSave(updatedGroup)
        setSearchResults([])
        setSearchQuery("")
        setShowAddMember(false)
        toast({ title: "Member added", description: `${user.name} has been added.` })
      }
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    }
  }

  const handleRemoveMember = async (memberId: number) => {
    try {
      const response = await groupService.removeMember(group.id, memberId)
      if (response.success) {
        const updatedGroup = {
          ...group,
          members: group.members.filter((member) => member.id !== memberId)
        }
        onSave(updatedGroup)
        toast({
          title: "Success",
          description: "Member removed from the group",
        })
      }
    } catch (error) {
      console.error("Failed to remove member:", error)
      toast({
        title: "Error",
        description: "Failed to remove member from the group",
        variant: "destructive"
      })
    }
  }

  const getSuggestions = (value: string) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0
      ? []
      : users.filter(user => user.email.toLowerCase().slice(0, inputLength) === inputValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNewMember(users.find(user => user.email === value) || null)
    setSuggestions(getSuggestions(value))
  }

  const handleMemberAction = (action: string, memberId: number, memberName: string) => {
    console.log(`Member action: ${action} for member ${memberId}`)

    toast({
      title: "Member action",
      description: `${action} action performed for ${memberName}`,
    })
  }

  const handleAddMember = () => {
    setShowAddMember(true)
  }

  const handleChangeAvatar = () => {
    console.log("Change group avatar clicked")
    toast({
      title: "Change avatar",
      description: "Avatar upload feature coming soon!",
    })
  }

  const handleDeleteGroup = () => {
    console.log("Delete group clicked")
    toast({
      title: "Delete group",
      description: "Are you sure? This action cannot be undone.",
      variant: "destructive"
    })
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Group name changed:", e.target.value)
    setGroupData(prev => ({ ...prev, name: e.target.value }))
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log("Group description changed:", e.target.value)
    setGroupData(prev => ({ ...prev, description: e.target.value }))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="cursor-pointer hover:bg-accent"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Group Settings</h1>
                <p className="text-muted-foreground">Manage your group settings and preferences</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Group Information</CardTitle>
                <CardDescription>Update your group's basic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={groupData.avatar} alt={groupData.name} />
                      <AvatarFallback>{groupData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                      onClick={() => {}}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label>Group Name</Label>
                      <Input
                        value={groupData.name}
                        onChange={(e) => setGroupData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter group name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={groupData.description}
                        onChange={(e) => setGroupData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter group description"
                      />
                    </div>
                  </div>
                </div>
                <Button onClick={handleSave}>Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Group Settings</CardTitle>
                <CardDescription>Manage your group's settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Member Invites</Label>
                    <p className="text-sm text-muted-foreground">Let members invite others to the group</p>
                  </div>
                  <Switch
                    checked={settings.allowMemberInvites}
                    onCheckedChange={(checked) => handleSettingChange('allowMemberInvites', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mute Notifications</Label>
                    <p className="text-sm text-muted-foreground">Stop receiving notifications from this group</p>
                  </div>
                  <Switch
                    checked={settings.muteNotifications}
                    onCheckedChange={(checked) => handleSettingChange('muteNotifications', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Read Receipts</Label>
                    <p className="text-sm text-muted-foreground">Show when messages have been read</p>
                  </div>
                  <Switch
                    checked={settings.readReceipts}
                    onCheckedChange={(checked) => handleSettingChange('readReceipts', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Group Members</CardTitle>
                    <CardDescription>Manage your group's members</CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddMember(true)}
                    className="cursor-pointer hover:bg-accent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {showAddMember && (
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    {isLoading ? (
                      <p className="text-sm text-muted-foreground">Searching...</p>
                    ) : searchResults.length > 0 ? (
                      <div className="space-y-2">
                        {searchResults.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-2 hover:bg-accent rounded-md"
                          >
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdateMember(user)}
                            >
                              Add
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : searchQuery ? (
                      <p className="text-sm text-muted-foreground">No users found</p>
                    ) : null}
                  </div>
                )}

                <div className="space-y-2">
                  {group.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2 hover:bg-accent rounded-md"
                    >
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
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
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible and destructive actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-destructive">Delete Group</Label>
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
    </div>
  )
}
