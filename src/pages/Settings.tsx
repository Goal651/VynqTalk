
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Camera, Save, Bell, Shield, Palette, User } from "lucide-react";
import { useCamera } from "@/hooks/use-camera";

export const Settings = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { openCamera, capturedImage, CameraDialog } = useCamera();
  const [settings, setSettings] = useState({
    notifications: {
      pushEnabled: true,
      soundEnabled: true,
      emailNotifications: false,
    },
    privacy: {
      showOnlineStatus: true,
      readReceipts: true,
      allowGroupInvites: true,
    },
    appearance: {
      fontSize: "medium",
      language: "en",
    }
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences</p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={capturedImage || user?.avatar} alt={user?.name} />
                <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                onClick={openCamera}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 flex-1">
              <div>
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" defaultValue={user?.name} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={user?.email} type="email" />
              </div>
            </div>
          </div>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Appearance Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>Customize how the app looks and feels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Font Size</Label>
            <Select value={settings.appearance.fontSize} onValueChange={(value) => 
              setSettings(prev => ({ ...prev, appearance: { ...prev.appearance, fontSize: value } }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Control how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications on this device</p>
            </div>
            <Switch
              checked={settings.notifications.pushEnabled}
              onCheckedChange={(checked) => handleNotificationChange('pushEnabled', checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sound</Label>
              <p className="text-sm text-muted-foreground">Play sounds for new messages</p>
            </div>
            <Switch
              checked={settings.notifications.soundEnabled}
              onCheckedChange={(checked) => handleNotificationChange('soundEnabled', checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive email summaries</p>
            </div>
            <Switch
              checked={settings.notifications.emailNotifications}
              onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Security
          </CardTitle>
          <CardDescription>Manage your privacy preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Online Status</Label>
              <p className="text-sm text-muted-foreground">Let others see when you're online</p>
            </div>
            <Switch
              checked={settings.privacy.showOnlineStatus}
              onCheckedChange={(checked) => handlePrivacyChange('showOnlineStatus', checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Read Receipts</Label>
              <p className="text-sm text-muted-foreground">Let others see when you've read their messages</p>
            </div>
            <Switch
              checked={settings.privacy.readReceipts}
              onCheckedChange={(checked) => handlePrivacyChange('readReceipts', checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Group Invites</Label>
              <p className="text-sm text-muted-foreground">Allow others to add you to groups</p>
            </div>
            <Switch
              checked={settings.privacy.allowGroupInvites}
              onCheckedChange={(checked) => handlePrivacyChange('allowGroupInvites', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {CameraDialog}
    </div>
  );
};
