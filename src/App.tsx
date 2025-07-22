import './App.css'
import { useEffect, useState } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, useNavigate } from "react-router-dom"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { SocketProvider } from "@/contexts/SocketContext"
import MaintenancePage from "@/pages/Maintenance"
import { systemStatusService, SystemStatus ,userService } from "@/api"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import Index from "@/pages/Index"
import { Groups } from "@/pages/Groups"
import { Settings } from "@/pages/Settings"
import { Notifications } from "@/pages/Notifications"
import { AdminPanel } from "@/pages/AdminPanel"
import Login from "@/pages/Login"
import Signup from "@/pages/Signup"
import NotFound from "@/pages/NotFound"
import { useToast } from "@/hooks"
import { User } from "@/types"
import { ChatView } from "@/components/ChatView"
import { UsersProvider, useUsers } from "@/contexts/UsersContext"
import { Toaster } from '@/components/ui/toaster'

const queryClient = new QueryClient()

const AppWithMaintenance = () => {
  const [maintenance, setMaintenance] = useState<SystemStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {

    systemStatusService.getStatus()
      .then(status => setMaintenance(status))
      .catch(err => {
        setError("Unable to fetch system status. Please try again later.")
      })
   
  }, [])

  useEffect(() => {

    if (
      maintenance &&
      maintenance.inMaintenance &&
      user &&
      user.userRole === "ADMIN" &&
      ["/login", "/signup", "/"].includes(location.pathname)
    ) {
      navigate("/admin", { replace: true });
    }
  }, [maintenance, user, location, navigate]);

  if (error) return <div className="flex items-center justify-center h-screen text-destructive">{error}</div>
  if (!maintenance) return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <span className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-lg text-muted-foreground font-medium">Checking system status...</span>
      </div>
    </div>
  )

  if (
    maintenance.inMaintenance &&
    !(user && user.userRole === 'ADMIN') &&
    location.pathname !== "/login" &&
    location.pathname !== "/signup"
  ) {
    return <MaintenancePage message={maintenance.message} />
  }
  return <AppRoutes />
}

const AppRoutes = () => {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        }
      >
        <Route path="chat" element={<ChatViewWrapper />} />
        <Route path="group" element={<Groups />} />
        <Route path="settings" element={<Settings />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="admin" element={<AdminPanel />} />
        <Route index element={<Navigate to="chat" />} />
      </Route>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <SocketProvider>
              <UsersProvider>
                <div className='overflow-hidden h-screen'>
                  <AppWithMaintenance />
                </div>
              </UsersProvider>
            </SocketProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Short timeout to allow auth state to be checked
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}

// Wrapper to provide ChatView props from Index
const ChatViewWrapper = () => {
  const { toast } = useToast()
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const usersContext = useUsers()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getAllUsers()
        if (response && response.data) {
          usersContext.setUsers(response.data)
        }
        setIsLoadingUsers(false)
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: "Error",
            description: "There was an error fetching users.",
            variant: "destructive",
          })
        }
        setIsLoadingUsers(false)
      }
    }
    fetchUsers()
  }, [])

  return <ChatView  isLoadingUsers={isLoadingUsers} />
}

export default App
