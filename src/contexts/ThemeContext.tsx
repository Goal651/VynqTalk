import React, { createContext, useState, useContext, useEffect } from "react";
import { settingsService } from "@/api";
import { useAuth } from "./AuthContext";
import { Theme } from "@/types";


interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("LIGHT");
  const { user } = useAuth();
  
  // Apply theme to document
  useEffect(() => {
    const applyTheme = (themeToApply: Theme) => {
      if (themeToApply === "SYSTEM") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.setAttribute("data-theme", prefersDark ? "DARK" : "LIGHT");
      } else {
        document.documentElement.setAttribute("data-theme", themeToApply);
      }
    };
    
    applyTheme(theme);
    localStorage.setItem("vynq-theme", theme);
    
    // Listen for system theme changes when using SYSTEM theme
    if (theme === "SYSTEM") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("SYSTEM");
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);
  
  // Load saved theme on initial render
  useEffect(() => {
    const loadTheme = async () => {
      // First try to get theme from backend if user is logged in
      if (user?.id) {
        try {
          const response = await settingsService.getSettings();
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
      if (savedTheme && ["LIGHT", "DARK", "SYSTEM"].includes(savedTheme)) {
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
