import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "@/types";
import { useToast } from "@/hooks";
import { LoginRequest, SignupRequest, ApiError } from "@/types";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "@/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the user is already logged in
  useEffect(() => {
    if (authService.isAuthenticated()) {
      const storedUser = authService.getStoredUser();
      if (storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
      // Only redirect if not already on /login or /signup
      if (location.pathname !== "/login" && location.pathname !== "/signup") {
        navigate("/login", { replace: true });
      }
    }
  }, [navigate, location]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const credentials: LoginRequest = { email, password };
      const response = await authService.login(credentials);
      if (response.success && response.data) {
        const apiUser = response.data.user;
        const user: User = {
          id: apiUser.id,
          bio: apiUser.bio,
          lastActive: apiUser.lastActive,
          createdAt: apiUser.createdAt,
          status: apiUser.status,
          name: apiUser.name,
          email: apiUser.email,
          avatar: apiUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${apiUser.name}`,
          userRole: apiUser.userRole || "USER"
        };

        setUser(user);
        setIsAuthenticated(true);
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        return true;
      } else {
        toast({
          title: "Verification failed",
          description: response.message || "Invalid credentials",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: "Login error",
        description: apiError.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const userData: SignupRequest = {
        name,
        email,
        password,
      };

      const response = await authService.signup(userData);
      if (response.success && response.data) {
        const apiUser = response.data.user;
        const user: User = {
          status: 'active',
          createdAt: Date(),
          lastActive: Date.now().toString(),
          id: apiUser.id,
          bio: apiUser.bio,
          name: apiUser.name,
          email: apiUser.email,
          avatar: apiUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${apiUser.name}`,
          userRole: apiUser.userRole || "USER"
        };

        setUser(user);
        setIsAuthenticated(true);

        toast({
          title: "Signup successful",
          description: "Welcome to PulseChat!",
        });
        return true;
      } else {
        toast({
          title: "Signup failed",
          description: response.message || "Failed to create account",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: "Signup error",
        description: apiError.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return true;
    }
  };



  const refreshUser = async (): Promise<void> => {
    try {
      if (!isAuthenticated) return
      const response = await authService.refreshUser()
      if (response) {
        setUser(response)
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "Redirecting to login ..",
        variant: "destructive"
      })
    }
  }


  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login')
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, useAuth };
