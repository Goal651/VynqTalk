
import React, { createContext, useState, useContext, useEffect } from "react";

type Theme = "blue" | "dark" | "cyberpunk" | "neon" | "ocean" | "sunset";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("dark");
  
  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("vynq-theme", theme);
  }, [theme]);
  
  // Load saved theme on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem("vynq-theme") as Theme | null;
    if (savedTheme && ["blue", "dark", "cyberpunk", "neon", "ocean", "sunset"].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);
  
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
