
import { Home, Users, Settings, Bell, Moon, Sun, Laptop, LogOut, Shield } from "lucide-react";
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

  const handleNavClick = (viewId: "chat" | "group" | "settings" | "notifications" | "admin") => {
    console.log("Navigation clicked:", viewId);
    onViewChange(viewId);
  };

  const handleThemeChange = (newTheme: "blue" | "dark" | "cyberpunk") => {
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
    <header className="border-b border-border bg-secondary/50 p-2 relative z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary mr-6 cursor-pointer select-none">Lavable</h1>
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentView === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => handleNavClick(item.id)}
                className="flex items-center gap-2 cursor-pointer hover:bg-accent transition-colors"
                type="button"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <div className="text-sm text-muted-foreground mr-2">
              Hi, {user.name}
            </div>
          )}
          
          <div className="flex border border-border rounded-md bg-background">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 cursor-pointer transition-colors ${theme === "blue" ? "bg-primary/20" : "hover:bg-accent"}`}
              onClick={() => handleThemeChange("blue")}
              title="Blue theme"
              type="button"
            >
              <Laptop className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 cursor-pointer transition-colors ${theme === "dark" ? "bg-primary/20" : "hover:bg-accent"}`}
              onClick={() => handleThemeChange("dark")}
              title="Dark theme"
              type="button"
            >
              <Moon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 cursor-pointer transition-colors ${theme === "cyberpunk" ? "bg-primary/20" : "hover:bg-accent"}`}
              onClick={() => handleThemeChange("cyberpunk")}
              title="Cyberpunk theme"
              type="button"
            >
              <Sun className="h-4 w-4" />
            </Button>
          </div>
          
          {onLogout && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-8 w-8 cursor-pointer hover:bg-accent transition-colors"
              title="Logout"
              type="button"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Mobile navigation */}
      <nav className="md:hidden flex justify-around pt-2 bg-background/80">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            onClick={() => handleNavClick(item.id)}
            className={`flex flex-col items-center py-2 cursor-pointer transition-colors ${
              currentView === item.id ? "text-primary bg-accent/50" : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
            }`}
            type="button"
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </nav>
    </header>
  );
};
