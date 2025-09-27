// src/pages/ChatbotPage.jsx
import React, { useState } from "react";
import Chatbot from "../components/Chatbot";
import "../styles/Chatbot.css";

export default function ChatbotPage() {
  const [lang, setLang] = useState("auto"); // default = auto detect

  
  return (
    <div className="chat-fullscreen">
      {/* Language selector */}
      <div className="chat-lang-selector">
        🌐 Choose Language: 
        <select value={lang} onChange={(e) => setLang(e.target.value)}>
          <option value="auto">Auto Detect</option>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="hi">Hindi</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="ja">Japanese</option>
          <option value="zh">Chinese</option>
        </select>
      </div>

      {/* Chatbot component */}
      <Chatbot lang={lang} />
    </div>
  );
}
