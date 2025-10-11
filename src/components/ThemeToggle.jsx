// src/components/ThemeToggle.jsx
import React from "react";

export default function ThemeToggle({ theme, toggle }) {
  return (
    <button className="theme-toggle" onClick={toggle}>
      {theme === "light" ? "🌞 Light" : "🌙 Dark"}
    </button>
  );
}
