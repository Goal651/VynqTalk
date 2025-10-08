import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/AuthContext"
import { useTheme } from "@/contexts/ThemeContext"
import { Camera, Save, Bell, Shield, Palette, UserCircle, Image, ChevronDown } from "lucide-react"
import { useCamera, useToast } from "@/hooks"
import { settingsService, userService } from "@/api"
import { UserSettings } from '@/types'
import { base64ToFile } from "@/lib"

export const Settings = () => {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const { openCamera, capturedImage, CameraDialog } = useCamera()
  const { toast } = useToast()

  // State management
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

  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  // Load user settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      if (!user?.id) return
      try {
        const response = await settingsService.getSettings()
        if (response.success && response.data) {
          setSettings(response.data)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive",
        })
      }
    }
    
    loadSettings()
  }, [user?.id, toast])

  // Handle avatar upload when image is captured or file is selected
  useEffect(() => {
    const handleAvatarUpload = async () => {
      if (!user?.id || (!capturedImage && !selectedFile)) return
      
      setIsUpdating(true)
      try {
        let file: File
        
        if (capturedImage) {
          file = base64ToFile(capturedImage, 'profile.png')
        } else if (selectedFile) {
          file = base64ToFile(selectedFile, 'profile.jpg')
        } else {
          return
        }
        
        const response = await userService.uploadAvatar(file)
        if (response.success && response.data) {
          toast({
            title: "Avatar Updated",
            description: "Your profile picture has been updated successfully.",
          })
          // Clear the selected file after successful upload
          setSelectedFile(null)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload avatar",
          variant: "destructive",
        })
      } finally {
        setIsUpdating(false)
      }
    }
    
    handleAvatarUpload()
  }, [capturedImage, selectedFile, toast, user?.id])

  // Handle file selection
  const handleFileSelect = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // Convert file to base64
        const reader = new FileReader()
        reader.onload = () => {
          setSelectedFile(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  // Handle profile updates
  const handleProfileSave = async () => {
    if (!user?.id || isUpdating) return
    
    setIsUpdating(true)
    try {
      await userService.updateProfile({
        name: profileData.name,
        bio: profileData.bio,
      })
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle theme changes
  const handleThemeChange = async (newTheme: "LIGHT" | "DARK" | "SYSTEM") => {
    if (!user?.id) return
    
    try {
      const updatedSettings = { ...settings, theme: newTheme }
      const response = await settingsService.updateSettings(updatedSettings)
      
      if (response.success) {
        setTheme(newTheme)
        setSettings(updatedSettings)
        toast({
          title: "Theme Updated",
          description: `Switched to ${newTheme.toLowerCase()} theme.`,
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

  // Handle privacy settings
  const handlePrivacyChange = async (key: string, value: boolean) => {
    if (!user?.id) return
    
    try {
      const updatedSettings = { ...settings, [key]: value }
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

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="text-center p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6 max-w-2xl mx-auto">
          
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                Profile
              </CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={selectedFile || capturedImage || user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-muted">
                      {user?.name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                        disabled={isUpdating}
                      >
                        <Camera className="h-3 w-3" />
                        <ChevronDown className="h-2 w-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={openCamera}>
                        <Camera className="h-4 w-4 mr-2" />
                        Take Photo
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleFileSelect}>
                        <Image className="h-4 w-4 mr-2" />
                        Select Photo
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself"
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleProfileSave} 
                disabled={isUpdating}
                className="w-full sm:w-auto"
              >
                <Save className="h-4 w-4 mr-2" />
                {isUpdating ? "Saving..." : "Save Changes"}
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
            <CardContent>
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select
                  value={theme}
                  onValueChange={(value: "LIGHT" | "DARK" | "SYSTEM") => handleThemeChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LIGHT">Light</SelectItem>
                    <SelectItem value="DARK">Dark</SelectItem>
                    <SelectItem value="SYSTEM">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security Section */}
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
                <div className="space-y-1">
                  <Label>Show Online Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Let others see when you're online
                  </p>
                </div>
                <Switch
                  checked={settings.showOnlineStatus}
                  onCheckedChange={(checked) => handlePrivacyChange('showOnlineStatus', checked)}
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
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        Push Notifications
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Advanced notification settings will be available soon
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Features Coming Soon */}
          <Card className="border-dashed border-2">
            <CardHeader>
              <CardTitle className="text-muted-foreground">Coming Soon</CardTitle>
              <CardDescription>
                Advanced features like data export, account management, and detailed notification controls
                are currently in development.
              </CardDescription>
            </CardHeader>
          </Card>

        </div>
      </ScrollArea>

      {CameraDialog}
    </div>
  )
}
