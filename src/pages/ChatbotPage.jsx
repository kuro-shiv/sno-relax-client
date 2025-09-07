// src/pages/ChatbotPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Chatbot from "../components/Chatbot";
import "../styles/Chatbot.css";

export default function ChatbotPage() {
  const navigate = useNavigate();

  return (
    <div className="chat-fullscreen">
      {/* Sticky header */}
      <header className="chat-header">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ⬅
        </button>
        <h1>🤖 SnoBot</h1>
        <div className="spacer" />
      </header>

      {/* Chatbot content */}
      <Chatbot />
    </div>
  );
}
