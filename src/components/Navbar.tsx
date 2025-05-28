
import { Home, Users, Settings, Bell, Moon, Sun, Laptop, LogOut, Shield, Palette, Zap, Waves, Sunset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "../contexts/ThemeContext";
import { User } from "@/types";

interface NavbarProps {
  currentView: "chat" | "group" | "settings" | "notifications" | "admin";
  onViewChange: (view: "chat" | "group" | "settings" | "notifications" | "admin") => void;
  onLogout?: () => void;
  user?: User;
}

export const Navbar = ({ currentView, onViewChange, onLogout, user }: NavbarProps) => {
  const { theme, setTheme } = useTheme();

  const navItems = [
    { id: "chat", label: "Chat", icon: Home },
    { id: "group", label: "Groups", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "admin", label: "Admin", icon: Shield },
  ] as const;

  const themeItems = [
    { id: "blue", label: "Classic", icon: Laptop, color: "bg-blue-500" },
    { id: "dark", label: "Dark", icon: Moon, color: "bg-gray-800" },
    { id: "cyberpunk", label: "Cyberpunk", icon: Zap, color: "bg-purple-600" },
    { id: "neon", label: "Neon", icon: Palette, color: "bg-pink-500" },
    { id: "ocean", label: "Ocean", icon: Waves, color: "bg-cyan-500" },
    { id: "sunset", label: "Sunset", icon: Sunset, color: "bg-orange-500" },
  ] as const;

  const handleNavClick = (viewId: "chat" | "group" | "settings" | "notifications" | "admin") => {
    console.log("Navigation clicked:", viewId);
    onViewChange(viewId);
  };

  const handleThemeChange = (newTheme: "blue" | "dark" | "cyberpunk" | "neon" | "ocean" | "sunset") => {
    console.log("Theme changed:", newTheme);
    setTheme(newTheme);
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-lg p-2 relative z-50 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center mr-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-3">
              <span className="text-primary-foreground font-bold text-lg">V</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent cursor-pointer select-none">
              VynqTalk
            </h1>
          </div>
          
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Button 
                type="button"
                key={item.id}
                variant={currentView === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => handleNavClick(item.id)}
                className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 transition-all duration-200 relative group"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
                {currentView === item.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden sm:flex items-center text-sm text-muted-foreground mr-2 bg-secondary/50 rounded-lg px-3 py-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Hi, <span className="font-medium ml-1">{user.name}</span>
            </div>
          )}
          
          <div className="flex border border-border rounded-lg bg-background/80 backdrop-blur-sm overflow-hidden">
            {themeItems.map((themeItem) => (
              <Button 
                type="button"
                key={themeItem.id}
                variant="ghost"
                size="icon"
                className={`h-8 w-8 cursor-pointer transition-all duration-200 relative group ${
                  theme === themeItem.id ? "bg-primary/20 shadow-inner" : "hover:bg-accent/50"
                }`}
                onClick={() => handleThemeChange(themeItem.id as any)}
                title={`${themeItem.label} theme`}
              >
                <themeItem.icon className="h-3.5 w-3.5" />
                <div className={`absolute inset-x-0 bottom-0 h-0.5 ${themeItem.color} ${
                  theme === themeItem.id ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                } transition-opacity`} />
              </Button>
            ))}
          </div>
          
          {onLogout && (
            <Button 
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-8 w-8 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Mobile navigation */}
      <nav className="md:hidden flex justify-around pt-3 bg-background/80 backdrop-blur-sm border-t border-border/50 mt-2">
        {navItems.map((item) => (
          <Button 
            type="button"
            key={item.id}
            variant="ghost"
            size="sm"
            onClick={() => handleNavClick(item.id)}
            className={`flex flex-col items-center py-2 cursor-pointer transition-all duration-200 relative ${
              currentView === item.id 
                ? "text-primary bg-accent/50 shadow-sm" 
                : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
            }`}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
            {currentView === item.id && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
            )}
          </Button>
        ))}
      </nav>
    </header>
  );
};
