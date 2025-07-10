import React, { useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

const THEMES = [
  { name: "OCEAN", label: "Ocean", color: "#00bcd4" },
  { name: "DARK", label: "Dark", color: "#23272f" },
  { name: "BLUE", label: "Blue", color: "#2563eb" },
  { name: "CYBERPUNK", label: "Cyberpunk", color: "#ff00ea" },
  { name: "NEON", label: "Neon", color: "#39ff14" },
  { name: "SUNSET", label: "Sunset", color: "#ff5e62" },
];

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const prevTheme = useRef(theme);

  // Live preview on hover/focus
  const previewTheme = (t: string) => {
    document.documentElement.setAttribute("data-theme", t);
  };
  // Restore theme on mouse leave/blur
  const restoreTheme = () => {
    document.documentElement.setAttribute("data-theme", theme);
  };

  return (
    <div className="flex gap-2 items-center">
      {THEMES.map((t) => (
        <button
          key={t.name}
          aria-label={`Switch to ${t.label} theme`}
          className={`w-8 h-8 rounded-full border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/70
            ${theme === t.name ? "ring-2 ring-primary border-primary scale-110" : "border-border hover:scale-105"}
            ${t.name === "CYBERPUNK" ? "cyberpunk-glow" : ""}
            ${t.name === "NEON" ? "neon-glow" : ""}
          `}
          style={{ background: t.color }}
          onMouseEnter={() => previewTheme(t.name)}
          onFocus={() => previewTheme(t.name)}
          onMouseLeave={restoreTheme}
          onBlur={restoreTheme}
          onClick={() => setTheme(t.name as any)}
          tabIndex={0}
        >
          <span className="sr-only">{t.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector; 