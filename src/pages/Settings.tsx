import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/AuthContext"
import { useTheme } from "@/contexts/ThemeContext"
import { Camera, Save, Bell, Shield, Palette, Download, Upload, Trash2, UserCircle } from "lucide-react"
import { useCamera } from "@/hooks/use-camera"
import { useToast } from "@/hooks/use-toast"
import { userService } from "@/api/services/users"
import { settingsService } from "@/api/services/settings"
import { User, UserSettings } from "@/types/user"
import { base64ToFile } from "@/lib/utils"

export const Settings = () => {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const { openCamera, capturedImage, CameraDialog } = useCamera()
  const { toast } = useToast()

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })

  const [settings, setSettings] = useState<UserSettings>({
    id: user?.id || 0,
    user: user as User,
    theme: theme,
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    emailNotifications: false,
    pushNotifications: true,
    soundEnabled: true,
    autoStatus: true,
    showOnlineStatus: true,
    readReceipts: true,
    profileVisibility: 'public'
  })

  useEffect(() => {
    if (user?.id) {
      const fetchSettings = async () => {
        if (!user?.id) return
        try {
          const response = await settingsService.getSettings(user.id)
          if (response.success && response.data) {
            setSettings(response.data)
            if (response.data.theme && response.data.theme !== theme) {
              setTheme(response.data.theme)
            }
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to fetch settings",
            variant: "destructive",
          })
        }
      }
      fetchSettings()
    }
  }, [user?.id])

  useEffect(() => {
    if (settings.theme !== theme) {
      setSettings(prev => ({ ...prev, theme }))
    }
  }, [theme])



  const handleProfileSave = async () => {
    if (!user?.id) return
    try {
      setSettings((prev) => {
        return { ...prev, user: { ...user, name: profileData.name, email: profileData.email } }
      })
      const response = await userService.updateProfile(user.id, settings.user)

      if (response.success && response.data) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    }
  }
  useEffect(() => {
    const handleAvatarUpload = async () => {
      if (!user?.id || !capturedImage) return
      try {
        const file = base64ToFile(capturedImage, 'profile.png')
        const response = await userService.uploadAvatar(user.id,file)
        if (response.success && response.data) {
          toast({
            title: "Avatar Updated",
            description: "Your profile picture has been updated successfully.",
          })
        }
        setSettings((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            avatar: response.data
          }
        }))
      await  handleProfileSave()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload avatar",
          variant: "destructive",
        })
      }
    }
    handleAvatarUpload()
  }, [capturedImage, toast, user?.id])

  const handleNotificationChange = async (key : string, value: boolean) => {
    if (!user?.id) return
    try {
      const updatedSettings = {
        ...settings,
        [key]: value
      }
      const response = await settingsService.updateSettings(user.id, updatedSettings)

      if (response.success) {
        setSettings(updatedSettings)
        toast({
          title: "Settings Updated",
          description: "Your notification settings have been updated.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive",
      })
    }
  }

  const handlePrivacyChange = async (key: string, value: boolean | 'public' | 'friends' | 'private') => {
    if (!user?.id) return
    try {
      const updatedSettings = {
        ...settings,
        [key]: value
      }
      const response = await settingsService.updateSettings(user.id, updatedSettings)

      if (response.success) {
        setSettings(updatedSettings)
        toast({
          title: "Settings Updated",
          description: "Your privacy settings have been updated.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update privacy settings",
        variant: "destructive",
      })
    }
  }

  const handleAppearanceChange = async (key: string, value: string | boolean) => {
    if (!user?.id) return
    try {
      const updatedSettings = {
        ...settings,
        [key]: value
      }
      const response = await settingsService.updateSettings(user.id, updatedSettings)

      if (response.success) {
        setSettings(updatedSettings)
        toast({
          title: "Settings Updated",
          description: "Your appearance settings have been updated.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update appearance settings",
        variant: "destructive",
      })
    }
  }

  const handleSecurityChange = async (key: string, value: boolean) => {
    if (!user?.id) return
    try {
      const updatedSettings = {
        ...settings,
        [key]: value
      }
      const response = await settingsService.updateSettings(user.id, updatedSettings)

      if (response.success) {
        setSettings(updatedSettings)
        toast({
          title: "Settings Updated",
          description: "Your security settings have been updated.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update security settings",
        variant: "destructive",
      })
    }
  }

  const handleThemeChange = async (newTheme: "blue" | "dark" | "cyberpunk" | "neon" | "ocean" | "sunset") => {
    if (!user?.id) return
    try {
      const updatedSettings = {
        ...settings,
        theme: newTheme
      }
      const response = await settingsService.updateSettings(user.id, updatedSettings)
      if (response.success) {
        setTheme(newTheme)
        setSettings(updatedSettings)
        toast({
          title: "Theme Updated",
          description: `Switched to ${newTheme} theme.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update theme",
        variant: "destructive",
      })
    }
  }

  const handleCameraClick = () => {
    openCamera()
  }

  const handleDataExport = async () => {
    try {
      // Implement data export functionality
      toast({
        title: "Data Export Started",
        description: "Your data export will be ready shortly.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      })
    }
  }

  const handleAccountDelete = async () => {
    try {
      // Implement account deletion functionality
      toast({
        title: "Account Deletion",
        description: "Please contact support to delete your account.",
        variant: "destructive",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process account deletion request",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 p-6 border-b">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
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
                        console.log("Name input changed:", e.target.value)
                        setProfileData(prev => ({ ...prev, name: e.target.value }))
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
                        console.log("Email input changed:", e.target.value)
                        setProfileData(prev => ({ ...prev, email: e.target.value }))
                      }}
                      type="email"
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
                  onValueChange={(value: "blue" | "dark" | "cyberpunk" | "neon" | "ocean" | "sunset") => handleThemeChange(value)}
                >
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Classic</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                    <SelectItem value="neon">Neon</SelectItem>
                    <SelectItem value="ocean">Ocean</SelectItem>
                    <SelectItem value="sunset">Sunset</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Font Size</Label>
                <Select
                  value={settings.language}
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
              <div className="space-y-2">
                <Label>Language</Label>
                <Select
                  value={settings.language}
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
                  <Label>Auto Status</Label>
                  <p className="text-sm text-muted-foreground">Automatically update your status</p>
                </div>
                <Switch
                  checked={settings.autoStatus}
                  onCheckedChange={(checked) => handleAppearanceChange("autoStatus", checked)}
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
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sound</Label>
                  <p className="text-sm text-muted-foreground">Play sounds for new messages</p>
                </div>
                <Switch
                  checked={settings.soundEnabled}
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
                  checked={settings.emailNotifications}
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
                  checked={settings.showOnlineStatus}
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
                  checked={settings.readReceipts}
                  onCheckedChange={(checked) => handlePrivacyChange('readReceipts', checked)}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Profile Visibility</Label>
                <Select
                  value={settings.profileVisibility}
                  onValueChange={(value: 'public' | 'friends' | 'private') => handlePrivacyChange('profileVisibility', value)}
                >
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="friends">Friends Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
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
        </div>
      </ScrollArea>

      {CameraDialog}
    </div>
  )
}
