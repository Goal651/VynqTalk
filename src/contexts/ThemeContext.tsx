import React, { createContext, useState, useContext, useEffect } from "react";
import { settingsService } from "@/api/services/settings";
import { useAuth } from "./AuthContext";

type Theme = "BLUE" | "DARK" | "CYBERPUNK" | "NEON" | "OCEAN" | "SUNSET"

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("BLUE");
  const { user } = useAuth();
  
  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("vynq-theme", theme);
  }, [theme]);
  
  // Load saved theme on initial render
  useEffect(() => {
    const loadTheme = async () => {
      // First try to get theme from backend if user is logged in
      if (user?.id) {
        try {
          const response = await settingsService.getSettings(user.id);
          if (response.success && response.data?.theme) {
            setTheme(response.data.theme);
            return;
          }
        } catch (error) {
          console.error("Failed to load theme from backend:", error);
        }
      }
      
      // Fallback to localStorage if backend fails or user is not logged in
      const savedTheme = localStorage.getItem("vynq-theme") as Theme | null;
      if (savedTheme && [ "BLUE" , "DARK" , "CYBERPUNK" , "NEON" , "OCEAN" , "SUNSET"].includes(savedTheme)) {
        setTheme(savedTheme);
      }
    };
    
    loadTheme();
  }, [user?.id]);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
