import { Home, Users, Settings, Bell, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { Link, useLocation } from "react-router-dom";
import { WebSocketStatus } from "./WebSocketStatus";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

type NavItem = {
  id: "chat" | "group" | "settings" | "notifications" | "admin";
  label: string;
  icon: React.ElementType;
  path: string;
};

interface NavbarProps {
  onLogout?: () => void;
  user?: User;
}

export const Navbar = ({ onLogout, user }: NavbarProps) => {
  const location = useLocation();
  const baseNavItems: NavItem[] = [
    { id: "chat", label: "Chat", icon: Home, path: "/chat" },
    { id: "group", label: "Groups", icon: Users, path: "/group" },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
    { id: "notifications", label: "Notifications", icon: Bell, path: "/notifications" },
  ];

  const adminNavItem: NavItem = { id: "admin", label: "Admin", icon: Shield, path: "/admin" };
  const navItems = user?.userRole=='ADMIN' ? [...baseNavItems, adminNavItem] : baseNavItems;

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  // Determine active tab based on pathname
  const activeTab = navItems.find(item => location.pathname.startsWith(item.path))?.id;

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    // Only run on mobile
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;

    let lastInnerHeight = window.innerHeight;
    const keyboardTimer: NodeJS.Timeout | null = null;

    const handleResize = () => {
      // If the viewport height shrinks by more than 150px, assume keyboard is open
      if (window.innerHeight < lastInnerHeight - 150) {
        setIsKeyboardOpen(true);
      } else if (window.innerHeight >= lastInnerHeight - 50) {
        setIsKeyboardOpen(false);
      }
      lastInnerHeight = window.innerHeight;
    };

    const handleFocusIn = (e: FocusEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT" || (e.target as HTMLElement).tagName === "TEXTAREA") {
        setIsKeyboardOpen(true);
      }
    };
    const handleFocusOut = (e: FocusEvent) => {
      setTimeout(() => setIsKeyboardOpen(false), 200); // Delay for keyboard animation
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("focusin", handleFocusIn);
    window.addEventListener("focusout", handleFocusOut);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("focusin", handleFocusIn);
      window.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  return (
    <>
      {/* Desktop/Header Nav */}
      <header className="border-b border-border bg-card/50 backdrop-blur-lg p-2 relative z-40 shadow-lg hidden md:block">
        <div className="container  mx-auto flex items-center justify-between">
          <div className="flex  items-center">
            <div className="flex items-center mr-16">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-3">
                <span className="text-primary-foreground font-bold text-lg">V</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent cursor-pointer select-none">
                VynqTalk
              </h1>
            </div>
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Link to={item.path} key={item.id} className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant={activeTab === item.id ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center gap-4 cursor-pointer hover:bg-accent/50 transition-all duration-200 relative group"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {activeTab === item.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <WebSocketStatus />
            {user && (
              <div className="hidden sm:flex items-center text-sm text-muted-foreground mr-2 bg-secondary/50 rounded-lg px-3 py-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Hi, <span className="font-medium ml-1">{user.name}</span>
              </div>
            )}
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
      </header>

      {/* Mobile Bottom Nav - fixed to bottom */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-background/90 backdrop-blur-sm border-t border-border/50 shadow-2xl transition-transform duration-200 ${isKeyboardOpen ? 'translate-y-full' : 'translate-y-0'}`}>
        {navItems.slice(0, 4).map((item) => (
          <Link to={item.path} key={item.id} className="flex flex-col items-center py-2 w-full">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={`flex flex-col py-6 items-center cursor-pointer transition-all duration-200 relative ${
                activeTab === item.id
                  ? "text-primary bg-accent/50 shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
              }`}
            >
              <item.icon className="h-4 w-4 " />
              <span className="text-xs font-medium">{item.label}</span>
              {activeTab === item.id && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </Button>
          </Link>
        ))}

        {/* More menu for overflow nav items and logout */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center py-2 w-full text-muted-foreground hover:text-foreground focus:outline-none">
              <MoreHorizontal className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">More</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="p-4">
            <div className="flex flex-col gap-2">
              {navItems.slice(4).map((item) => (
                <Link to={item.path} key={item.id} className="w-full">
                  <Button
                    type="button"
                    variant={activeTab === item.id ? "default" : "ghost"}
                    size="lg"
                    className="w-full flex items-center gap-3 justify-start"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              ))}
              {onLogout && (
                <Button
                  type="button"
                  onClick={handleLogout}
                  variant="destructive"
                  size="lg"
                  className="w-full flex items-center gap-3 justify-start mt-2"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </>
  );
};
