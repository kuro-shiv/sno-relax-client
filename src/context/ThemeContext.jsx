import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to 'dark'
    const savedTheme = localStorage.getItem("sno_theme");
    return savedTheme || "dark";
  });

  // Available themes (only light and dark)
  const themes = [
    { id: "light", name: "Light", hex: "#f3f4f6" },
    { id: "dark", name: "Dark", hex: "#0f172a" }
  ];

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sno_theme", theme);
    // Apply theme to document
    document.documentElement.setAttribute("data-theme", theme);
    
    // Apply theme class to body and other elements
    // swap theme class on body
    document.body.classList.remove(...Array.from(document.body.classList).filter(c => c.startsWith("theme-")));
    document.body.classList.add(`theme-${theme}`);

    // Update Chatbot container theme attribute
    const chatbotContainer = document.querySelector(".chatbot-container");
    if (chatbotContainer) {
      chatbotContainer.setAttribute("data-theme", theme);
      chatbotContainer.classList.remove(...Array.from(chatbotContainer.classList).filter(c => c.startsWith("theme-")));
      chatbotContainer.classList.add(`theme-${theme}`);
    }

    // Apply CSS variables for easier global theming
    const t = themes.find(t => t.id === theme) || themes[0];
    const baseHex = t.hex || "#667eea";
    document.documentElement.style.setProperty("--app-primary", baseHex);
    document.documentElement.style.setProperty("--app-gradient", theme === "light" ? `linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)` : `linear-gradient(135deg, ${baseHex} 0%, ${baseHex}66 100%)`);

    // foreground and background
    if (theme === "light") {
      document.documentElement.style.setProperty("--app-foreground", "#0f172a");
      document.documentElement.style.setProperty("--app-background", "#ffffff");
    } else {
      document.documentElement.style.setProperty("--app-foreground", "#ffffff");
      document.documentElement.style.setProperty("--app-background", "#0b1220");
    }
  }, [theme]);
  

  const toggleTheme = () => {
    // Toggle between dark and light (legacy support)
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const setSpecificTheme = (themeName) => {
    if (themes.find(t => t.id === themeName)) {
      setTheme(themeName);
    }
  };

  const getCurrentTheme = () => {
    return themes.find(t => t.id === theme);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      toggleTheme, 
      setSpecificTheme,
      themes,
      getCurrentTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

