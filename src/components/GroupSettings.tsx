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
import { ArrowLeft, Camera, UserPlus, UserMinus, Crown, Shield, Trash2, Plus, X, Search } from "lucide-react"
import { Group, User } from "@/types"
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
  const [members, setMembers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"chat" | "settings">("chat")

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

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const response = await groupService.getGroupMembers(group.id)
        if (response.success && response.data) {
          setMembers(response.data)
        }
      } catch (error) {
        console.error("Failed to load group members:", error)
        toast({
          title: "Error",
          description: "Failed to load group members",
          variant: "destructive"
        })
      }
    }
    loadMembers()
  }, [group.id, toast])

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

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    try {
      const response = await userService.searchUsers(query)
      if (response.success && response.data) {
        const filteredResults = response.data.filter(
          (user) => !members.some((member) => member.id === user.id)
        )
        setSearchResults(filteredResults)
      }
    } catch (error) {
      console.error("Failed to search users:", error)
      toast({
        title: "Error",
        description: "Failed to search users",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateMember = async (user: User) => {
    try {
      const res = await groupService.addMember(group.id, user)
      console.log(res)
      toast({ title: "Member added", description: `${user.name} has been added.` })
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    }
  }

  const handleRemoveMember = async (memberId: number) => {
    try {
      const response = await groupService.removeMember(group.id, memberId)
      if (response.success) {
        setMembers(members.filter((member) => member.id !== memberId))
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

  return (
    <div className="flex flex-col h-full">
      <Card className="border-b rounded-none flex-shrink-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="cursor-pointer hover:bg-accent"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Avatar>
                <AvatarImage src={group.avatar} alt={group.name} />
                <AvatarFallback>{group.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{group.name}</h2>
                <p className="text-sm text-muted-foreground">{members.length} members</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab(activeTab === "chat" ? "settings" : "chat")}
              >
                {activeTab === "chat" ? "Settings" : "Chat"}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {activeTab === "chat" ? (
        <GroupChat group={group} users={members} />
      ) : (
        <div className="flex-1 overflow-hidden">
          <Card className="border-b rounded-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Group Members</h3>
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

              {showAddMember && (
                <div className="mb-4">
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
                    <p className="text-sm text-muted-foreground mt-2">Searching...</p>
                  ) : searchResults.length > 0 ? (
                    <ScrollArea className="h-32 mt-2">
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
                    </ScrollArea>
                  ) : searchQuery ? (
                    <p className="text-sm text-muted-foreground mt-2">No users found</p>
                  ) : null}
                </div>
              )}

              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-2">
                  {members.map((member) => (
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
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
