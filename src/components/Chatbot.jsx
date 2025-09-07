// src/components/Chatbot.jsx
import React, { useState, useEffect, useRef } from "react";
import "../styles/Chatbot.css";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I'm SnoBot 🌱. How are you feeling today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // ✅ API base URL (Render backend for production, localhost for dev)
  const API_BASE =
    process.env.NODE_ENV === "production"
      ? "https://sno-relax-server-hostside.onrender.com"
      : "http://localhost:5000";

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      if (data.text) {
        setMessages((prev) => [...prev, { sender: "bot", text: data.text }]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Sorry, I couldn’t connect to the server." },
      ]);
    }

    setLoading(false);
    setInput("");
  };

  return (
    <>
      {/* Chat window */}
      <div className="chat-window">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            <div className="bubble">{msg.text}</div>
          </div>
        ))}

        {loading && (
          <div className="message bot">
            <div className="bubble">SnoBot is thinking...</div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>➤</button>
      </div>
    </>
  );
}
