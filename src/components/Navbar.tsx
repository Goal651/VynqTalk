
import { Home, Users, Settings, Bell, Moon, Sun, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "../contexts/ThemeContext";

interface NavbarProps {
  currentView: "chat" | "group" | "settings" | "notifications";
  onViewChange: (view: "chat" | "group" | "settings" | "notifications") => void;
}

export const Navbar = ({ currentView, onViewChange }: NavbarProps) => {
  const { theme, setTheme } = useTheme();

  const navItems = [
    { id: "chat", label: "Chat", icon: Home },
    { id: "group", label: "Groups", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
  ] as const;

  return (
    <header className="border-b border-border bg-secondary/50 p-2">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary mr-6">Lavable</h1>
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentView === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewChange(item.id)}
                className="flex items-center gap-2"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex border border-border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${theme === "blue" ? "bg-primary/20" : ""}`}
              onClick={() => setTheme("blue")}
              title="Blue theme"
            >
              <Laptop className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${theme === "dark" ? "bg-primary/20" : ""}`}
              onClick={() => setTheme("dark")}
              title="Dark theme"
            >
              <Moon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${theme === "cyberpunk" ? "bg-primary/20" : ""}`}
              onClick={() => setTheme("cyberpunk")}
              title="Cyberpunk theme"
            >
              <Sun className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation */}
      <nav className="md:hidden flex justify-around pt-2">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            onClick={() => onViewChange(item.id)}
            className={`flex flex-col items-center py-2 ${
              currentView === item.id ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </nav>
    </header>
  );
};
