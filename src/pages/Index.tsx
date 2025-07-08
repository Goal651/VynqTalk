import { Outlet } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect } from "react"

const Index = () => {
  const { user, logout, refreshUser } = useAuth()

  useEffect(() => {
    refreshUser()
  }, [])

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen bg-background">
        <Navbar
          onLogout={logout}
          user={user}
        />
        <main className="flex-1 overflow-hidden relative pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  )
}

export default Index
