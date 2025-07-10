import { Outlet } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState } from "react"

const Index = () => {
  const { user, logout, refreshUser } = useAuth()

  useEffect(() => {
    refreshUser()
  }, [])

  // Keyboard detection logic for mobile
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;
    let lastInnerHeight = window.innerHeight;
    const handleResize = () => {
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
      setTimeout(() => setIsKeyboardOpen(false), 200);
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
    <ThemeProvider>
      <div className="flex flex-col h-screen bg-background">
        <Navbar
          onLogout={logout}
          user={user}
        />
        <main className={`flex-1 overflow-hidden relative ${isKeyboardOpen ? 'pb-0' : 'pb-20'} md:pb-0`}>
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  )
}

export default Index
