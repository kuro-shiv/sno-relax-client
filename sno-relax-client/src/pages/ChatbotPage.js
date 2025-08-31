import React from "react";
import Chatbot from "../components/Chatbot";
import { useNavigate } from "react-router-dom";

export default function ChatbotPage() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <h1>🤖 AI Chatbot</h1>
      <Chatbot />
      <button onClick={() => navigate("/")} className="btn">
        ⬅ Back to Dashboard
      </button>
    </div>
  );
}
