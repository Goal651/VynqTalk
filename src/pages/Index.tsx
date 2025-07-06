import { Outlet } from "react-router-dom"
import { Navbar } from "../components/Navbar"
import { ThemeProvider } from "../contexts/ThemeContext"
import { useAuth } from "@/contexts/AuthContext"

const Index = () => {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen bg-background">
        <Navbar
          onLogout={handleLogout}
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
