import React from "react";
import { useTheme } from "../context/ThemeContext";
import "../styles/ThemeSwitcher.css";

export default function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="theme-switcher">
      <span className="theme-label">🎨 Theme:</span>
      <div className="theme-buttons">
        {themes.map((t) => (
          <button
            key={t.id}
            className={`theme-btn ${theme === t.id ? "active" : ""}`}
            onClick={() => setTheme(t.id)}
            title={t.name}
            style={{
              backgroundColor: theme === t.id ? t.hex : "transparent",
              borderColor: t.hex,
              color: theme === t.id ? "white" : t.hex,
            }}
          >
            {t.name.charAt(0)}
          </button>
        ))}
      </div>
    </div>
  );
}
