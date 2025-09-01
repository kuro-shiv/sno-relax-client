// src/pages/ChatbotPage.js
import React from "react";
import Chatbot from "../components/Chatbot";
import { useNavigate } from "react-router-dom";
import "../styles/Chatbot.css";

export default function ChatbotPage() {
  const navigate = useNavigate();

  return (
    <div className="chatbot-page">
      <div className="chat-container">
        <header className="chat-header">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            ⬅
          </button>
          <h1>🤖 SnoBot</h1>
          <div className="spacer" />
        </header>

        <Chatbot />
      </div>
    </div>
  );
}
