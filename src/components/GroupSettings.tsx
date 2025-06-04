import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Camera, UserPlus, UserMinus, Crown, Shield, Trash2 } from "lucide-react"
import { Group, User } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { userService } from "@/api/services/users"
import { groupService } from "@/api/services/groups"

interface GroupSettingsProps {
  group: Group
  onBack: () => void
  onSave: (group: Group) => void
}

export const GroupSettings = ({ group, onBack, onSave }: GroupSettingsProps) => {
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

  const { toast } = useToast()

  const [showAddMember, setShowAddMember] = useState(false)
  const [newMember, setNewMember] = useState<User | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [suggestions, setSuggestions] = useState<User[]>([])
  const [users, setUsers] = useState<User[]>([])

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

  const handleUpdateMember = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    try {
      const res = await groupService.addMember(group.id, newMember)
      console.log(res)
      toast({ title: "Member added", description: `${newMember.name} has been added.` })
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    }
  }
  return (
    <ScrollArea className="h-[calc(100vh-100px)]">
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              console.log("Back button clicked")
              onBack()
            }}
            className="cursor-pointer hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Group Settings</h1>
            <p className="text-muted-foreground">Manage {group.name} settings and members</p>
          </div>
        </div>


        {/* Group Info */}
        <Card>
          <CardHeader>
            <CardTitle>Group Information</CardTitle>
            <CardDescription>Update group details and appearance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={groupData.avatar} alt={groupData.name} />
                  <AvatarFallback>{groupData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <Button type="button"
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 cursor-pointer"
                  onClick={handleChangeAvatar}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2 flex-1">
                <div>
                  <Label htmlFor="groupName">Group Name</Label>
                  <Input
                    id="groupName"
                    value={groupData.name}
                    onChange={handleNameChange}
                    className="cursor-text"
                  />
                </div>
                <div>
                  <Label htmlFor="groupDescription">Description</Label>
                  <Textarea
                    id="groupDescription"
                    value={groupData.description}
                    onChange={handleDescriptionChange}
                    placeholder="Describe your group"
                    className="cursor-text resize-none"
                  />
                </div>
              </div>
            </div>
            <Button type="button" onClick={handleSave} className="cursor-pointer">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Group Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Group Settings</CardTitle>
            <CardDescription>Configure group behavior and permissions</CardDescription>
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
                <p className="text-sm text-muted-foreground">Turn off notifications for this group</p>
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
                <p className="text-sm text-muted-foreground">Show when messages are read</p>
              </div>
              <Switch
                checked={settings.readReceipts}
                onCheckedChange={(checked) => handleSettingChange('readReceipts', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Message History</Label>
                <p className="text-sm text-muted-foreground">Keep message history for new members</p>
              </div>
              <Switch
                checked={settings.messageHistory}
                onCheckedChange={(checked) => handleSettingChange('messageHistory', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Members Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Members ({group.members.length})</CardTitle>
                <CardDescription>Manage group members and their roles</CardDescription>
              </div>
              <Button type="button" className="cursor-pointer" onClick={handleAddMember}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {group.members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant={member.role === "admin" ? "default" : "secondary"}>
                          {member.role}
                        </Badge>
                        {member.role === "admin" && <Crown className="h-3 w-3 text-yellow-500" />}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleMemberAction("promote", member.id, member.name)}
                      className="cursor-pointer hover:bg-accent"
                    >
                      <Shield className="h-4 w-4" />
                    </Button>
                    <Button type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleMemberAction("remove", member.id, member.name)}
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {showAddMember && (
              <div className="my-4 p-4 bg-muted rounded-lg shadow-sm border">
                <Label htmlFor="add-member-email" className="mb-2 block text-sm font-medium">
                  Add a new member by email
                </Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="add-member-email"
                      placeholder="Enter member email"
                      value={newMember?.email}
                      onChange={handleInputChange}
                      disabled={isAdding}
                      className="w-full"
                    />
                    {suggestions.length > 0 && (
                      <ul className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1">
                        {suggestions.map((user) => (
                          <li
                            key={user.id}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setNewMember(user);
                              setSuggestions([]);
                            }}
                          >
                            {user.name} ({user.email})
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <Button
                    onClick={handleUpdateMember}
                    disabled={!newMember?.email || isAdding}
                    className="sm:w-auto"
                  >
                    Add
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowAddMember(false)}
                    disabled={isAdding}
                    className="sm:w-auto"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions for this group</CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="button"
              variant="destructive"
              onClick={handleDeleteGroup}
              className="cursor-pointer"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Group
            </Button>
          </CardContent>
        </Card>

      </div>
    </ScrollArea>
  )
}
