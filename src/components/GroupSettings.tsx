
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Camera, UserPlus, UserMinus, Crown, Shield, Trash2 } from "lucide-react";
import { Group } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface GroupSettingsProps {
  group: Group;
  onBack: () => void;
  onSave: (group: Group) => void;
}

export const GroupSettings = ({ group, onBack, onSave }: GroupSettingsProps) => {
  const [groupData, setGroupData] = useState({
    name: group.name,
    description: group.description || "",
    avatar: group.avatar,
  });
  
  const [settings, setSettings] = useState({
    allowMemberInvites: true,
    muteNotifications: false,
    readReceipts: true,
    messageHistory: true,
  });

  const { toast } = useToast();

  const mockMembers = [
    { id: "u1", name: "Alice Johnson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice", role: "admin" },
    { id: "u2", name: "Bob Smith", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob", role: "member" },
    { id: "u3", name: "Charlie Brown", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=charlie", role: "member" },
  ];

  const handleSave = () => {
    console.log("Saving group settings:", groupData);
    const updatedGroup: Group = {
      ...group,
      name: groupData.name,
      description: groupData.description,
      avatar: groupData.avatar,
    };
    onSave(updatedGroup);
    
    toast({
      title: "Settings saved",
      description: "Group settings have been updated successfully",
    });
  };

  const handleSettingChange = (key: string, value: boolean) => {
    console.log(`Setting ${key} changed to:`, value);
    setSettings(prev => ({ ...prev, [key]: value }));
    
    toast({
      title: "Setting updated",
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} has been ${value ? 'enabled' : 'disabled'}`,
    });
  };

  const handleMemberAction = (action: string, memberId: string, memberName: string) => {
    console.log(`Member action: ${action} for member ${memberId}`);
    
    toast({
      title: "Member action",
      description: `${action} action performed for ${memberName}`,
    });
  };

  const handleAddMember = () => {
    console.log("Add member clicked");
    toast({
      title: "Add member",
      description: "Member invitation feature coming soon!",
    });
  };

  const handleChangeAvatar = () => {
    console.log("Change group avatar clicked");
    toast({
      title: "Change avatar",
      description: "Avatar upload feature coming soon!",
    });
  };

  const handleDeleteGroup = () => {
    console.log("Delete group clicked");
    toast({
      title: "Delete group",
      description: "Are you sure? This action cannot be undone.",
      variant: "destructive"
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Group name changed:", e.target.value);
    setGroupData(prev => ({ ...prev, name: e.target.value }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log("Group description changed:", e.target.value);
    setGroupData(prev => ({ ...prev, description: e.target.value }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button type="button" 
          variant="ghost" 
          size="icon"
          onClick={() => {
            console.log("Back button clicked");
            onBack();
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
              <CardTitle>Members ({mockMembers.length})</CardTitle>
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
            {mockMembers.map((member) => (
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
  );
};
