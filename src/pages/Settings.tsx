
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
import { Camera, Save, Bell, Shield, Palette, User, Download, Upload, Trash2 } from "lucide-react";
import { useCamera } from "@/hooks/use-camera";
import { useToast } from "@/hooks/use-toast";

export const Settings = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { openCamera, capturedImage, CameraDialog } = useCamera();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: "",
    location: "",
  });
  
  const [settings, setSettings] = useState({
    notifications: {
      pushEnabled: true,
      soundEnabled: true,
      emailNotifications: false,
      desktopNotifications: true,
    },
    privacy: {
      showOnlineStatus: true,
      readReceipts: true,
      allowGroupInvites: true,
      showLastSeen: false,
    },
    appearance: {
      fontSize: "medium",
      language: "en",
      compactMode: false,
    },
    security: {
      twoFactorAuth: false,
      loginAlerts: true,
      dataDownload: false,
    }
  });

  const handleProfileSave = () => {
    console.log("Saving profile data:", profileData);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    console.log(`Notification setting ${key} changed to:`, value);
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    console.log(`Privacy setting ${key} changed to:`, value);
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  const handleAppearanceChange = (key: string, value: string | boolean) => {
    console.log(`Appearance setting ${key} changed to:`, value);
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [key]: value
      }
    }));
  };

  const handleSecurityChange = (key: string, value: boolean) => {
    console.log(`Security setting ${key} changed to:`, value);
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: value
      }
    }));
  };

  const handleThemeChange = (newTheme: "blue" | "dark" | "cyberpunk") => {
    console.log("Theme changed to:", newTheme);
    setTheme(newTheme);
    toast({
      title: "Theme Updated",
      description: `Switched to ${newTheme} theme.`,
    });
  };

  const handleCameraClick = () => {
    console.log("Camera button clicked");
    openCamera();
  };

  const handleDataExport = () => {
    console.log("Exporting user data");
    toast({
      title: "Data Export Started",
      description: "Your data export will be ready shortly.",
    });
  };

  const handleAccountDelete = () => {
    console.log("Account deletion requested");
    toast({
      title: "Account Deletion",
      description: "Please contact support to delete your account.",
      variant: "destructive",
    });
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
              <Button type="button"
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 cursor-pointer hover:bg-accent"
                onClick={handleCameraClick}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 flex-1">
              <div>
                <Label htmlFor="name">Display Name</Label>
                <Input 
                  id="name" 
                  value={profileData.name}
                  onChange={(e) => {
                    console.log("Name input changed:", e.target.value);
                    setProfileData(prev => ({ ...prev, name: e.target.value }));
                  }}
                  className="cursor-text"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={profileData.email}
                  onChange={(e) => {
                    console.log("Email input changed:", e.target.value);
                    setProfileData(prev => ({ ...prev, email: e.target.value }));
                  }}
                  type="email"
                  className="cursor-text"
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Input 
                  id="bio" 
                  value={profileData.bio}
                  onChange={(e) => {
                    console.log("Bio input changed:", e.target.value);
                    setProfileData(prev => ({ ...prev, bio: e.target.value }));
                  }}
                  placeholder="Tell us about yourself"
                  className="cursor-text"
                />
              </div>
            </div>
          </div>
          <Button type="button" onClick={handleProfileSave} className="cursor-pointer">
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
            <Select 
              value={theme} 
              onValueChange={(value: "blue" | "dark" | "cyberpunk") => handleThemeChange(value)}
            >
              <SelectTrigger className="cursor-pointer">
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
            <Select 
              value={settings.appearance.fontSize} 
              onValueChange={(value) => handleAppearanceChange("fontSize", value)}
            >
              <SelectTrigger className="cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Language</Label>
            <Select 
              value={settings.appearance.language} 
              onValueChange={(value) => handleAppearanceChange("language", value)}
            >
              <SelectTrigger className="cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Compact Mode</Label>
              <p className="text-sm text-muted-foreground">Use a more compact interface</p>
            </div>
            <Switch
              checked={settings.appearance.compactMode}
              onCheckedChange={(checked) => handleAppearanceChange("compactMode", checked)}
            />
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
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Desktop Notifications</Label>
              <p className="text-sm text-muted-foreground">Show notifications on desktop</p>
            </div>
            <Switch
              checked={settings.notifications.desktopNotifications}
              onCheckedChange={(checked) => handleNotificationChange('desktopNotifications', checked)}
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
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Last Seen</Label>
              <p className="text-sm text-muted-foreground">Let others see when you were last online</p>
            </div>
            <Switch
              checked={settings.privacy.showLastSeen}
              onCheckedChange={(checked) => handlePrivacyChange('showLastSeen', checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Add extra security to your account</p>
            </div>
            <Switch
              checked={settings.security.twoFactorAuth}
              onCheckedChange={(checked) => handleSecurityChange('twoFactorAuth', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
          <CardDescription>Manage your data and account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button type="button" 
            variant="outline" 
            onClick={handleDataExport}
            className="w-full cursor-pointer hover:bg-accent"
          >
            <Download className="h-4 w-4 mr-2" />
            Export My Data
          </Button>
          <Button type="button" 
            variant="outline" 
            onClick={() => console.log("Import data clicked")}
            className="w-full cursor-pointer hover:bg-accent"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Data
          </Button>
          <Separator />
          <Button type="button" 
            variant="destructive" 
            onClick={handleAccountDelete}
            className="w-full cursor-pointer"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </Button>
        </CardContent>
      </Card>

      {CameraDialog}
    </div>
  );
};
