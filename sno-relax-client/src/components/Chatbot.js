// src/components/Chatbot.js
import React, { useState } from "react";
import "../styles/Chatbot.css";

function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I'm SnoBot 🌱. How are you feeling today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }]);

    // simple bot reply
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "I hear you 💙. Let's relax together." }
      ]);
    }, 800);

    setInput("");
  };

  return (
    <div className="chatbot">
      <div className="chatbot-container">
        <header className="chatbot-header">🤖 SnoBot</header>

        <div className="chat-window">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
