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
import { useCamera ,useToast} from "@/hooks"
import { settingsService,userService,notificationService } from "@/api"
import { UserSettings } from '@/types'
import { base64ToFile ,requestNotificationPermission, subscribeUserToPush} from "@/lib"

export const Settings = () => {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const { openCamera, capturedImage, CameraDialog } = useCamera()
  const { toast } = useToast()

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
  })

  const [settings, setSettings] = useState<UserSettings>({
    id: user?.id || 0,
    user: user,
    theme: theme,
    showOnlineStatus: true,
  })

  useEffect(() => {
    if (user?.id) {
      const fetchSettings = async () => {
        if (!user?.id) return
        try {
          const response = await settingsService.getSettings()
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
        return { ...prev, user: { ...user, name: profileData.name, bio: profileData.bio } }
      })
      const response = await userService.updateProfile(profileData)

      if (response.success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        })
      }
    } catch (error) {
      console.error(error)
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
        const response = await userService.uploadAvatar(file)
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

  const handleNotificationChange = async (key: string, value: boolean) => {
    if (!user?.id) return
    try {
      const updatedSettings = {
        ...settings,
        [key]: value
      }
      const response = await settingsService.updateSettings(updatedSettings)

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
      const response = await settingsService.updateSettings(updatedSettings)

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
      const response = await settingsService.updateSettings(updatedSettings)

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
      const response = await settingsService.updateSettings(updatedSettings)

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

  const handleThemeChange = async (newTheme: "BLUE" | "DARK" | "CYBERPUNK" | "NEON" | "OCEAN" | "SUNSET") => {
    if (!user?.id) return
    try {
      const updatedSettings = {
        ...settings,
        theme: newTheme
      }
      const response = await settingsService.updateSettings(updatedSettings)
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
      const response = await userService.getUserData()
      console.log("Data exported is ", response.data)
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

      await userService.deleteUser()
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

  const handleEnableNotifications = async () => {
    if (!('Notification' in window)) {
      toast({ title: 'Not supported', description: 'Notifications are not supported in this browser.', variant: 'destructive' });
      return;
    }
    const permission = await requestNotificationPermission();
    if (permission === 'granted') {
      const subscription = await subscribeUserToPush();
      if (subscription) {
        try {
          await notificationService.registerDevice(subscription);
          toast({ title: 'Notifications enabled', description: 'You will now receive notifications.' });
        } catch (err) {
          toast({ title: 'Error', description: 'Failed to register for notifications.', variant: 'destructive' });
        }
      }
    } else {
      toast({ title: 'Permission denied', description: 'You must allow notifications in your browser.' });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="text-center p-3 sm:p-6 border-b ">
        <h1 className="text-xl sm:text-2xl font-bold">Settings</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">Manage your account and application preferences</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 sm:p-6 space-y-4 sm:space-y-6 max-w-4xl mx-auto">
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
              <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-3 sm:space-y-0">
                <div className="relative flex-shrink-0">
                  <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
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
                <div className="space-y-2 flex-1 w-full">
                  <div>
                    <Label htmlFor="name">Display Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => {
                        setProfileData(prev => ({ ...prev, name: e.target.value }))
                      }}
                      className="cursor-text text-sm py-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Bio</Label>
                    <Input
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => {
                        setProfileData(prev => ({ ...prev, bio: e.target.value }))
                      }}
                      type="text"
                      className="cursor-text text-sm py-2"
                    />
                  </div>
                </div>
              </div>
              <Button type="button" onClick={handleProfileSave} className="cursor-pointer w-full sm:w-auto">
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
                  onValueChange={(value: "BLUE" | "DARK" | "CYBERPUNK" | "NEON" | "OCEAN" | "SUNSET") => handleThemeChange(value)}
                >
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BLUE">Classic</SelectItem>
                    <SelectItem value="DARK">Dark</SelectItem>
                    <SelectItem value="CYBERPUNK">Cyberpunk</SelectItem>
                    <SelectItem value="NEON">Neon</SelectItem>
                    <SelectItem value="OCEAN">Ocean</SelectItem>
                    <SelectItem value="SUNSET">Sunset</SelectItem>
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
                  checked={settings.notificationEnabled}
                  onCheckedChange={(checked) => handleNotificationChange('notificationEnabled', checked)}
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

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Enable or disable browser notifications for new messages.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleEnableNotifications} variant="outline" className="flex items-center gap-2">
                <Bell className="h-4 w-4" /> Enable Notifications
              </Button>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      {CameraDialog}
    </div>
  )
}
