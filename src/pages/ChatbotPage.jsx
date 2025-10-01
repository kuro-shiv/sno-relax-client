// src/pages/ChatbotPage.jsx
import React, { useState } from "react";
import Chatbot from "../components/Chatbot";
import "../styles/Chatbot.css";

export default function ChatbotPage() {
  const [lang, setLang] = useState("auto"); // default = auto detect

  
  return (
    <div className="chat-fullscreen">
      
      <Chatbot lang={lang} />
    </div>
  );
}
