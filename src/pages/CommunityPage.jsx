import React, { useState, useEffect, useRef } from "react";
import "../styles/CommunityPage.css";

export default function CommunityPage() {
  const [view, setView] = useState("menu"); // menu | group | personal | requests
  const [selectedChat, setSelectedChat] = useState(null);

  const [messages, setMessages] = useState([
    { id: 1, sender: "Alice", text: "Welcome to SnoRelax 🌙", self: false },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const userId = localStorage.getItem("sno_userId") || "Guest123";
  const chatEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Send message
  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg = {
      id: Date.now(),
      sender: userId,
      text: newMessage,
      self: true,
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
  };

  return (
    <div className="community-container">
      {/* Header */}
      <header className="community-header">
        <div className="left-controls">
          {view !== "menu" && (
            <button className="back-btn" onClick={() => setView("menu")}>
              ⬅
            </button>
          )}
          <h2>
            {view === "menu" && "🌍 Community"}
            {view === "group" && "👥 Group Chat"}
            {view === "personal" && `💬 Chat with ${selectedChat || "Friend"}`}
            {view === "requests" && "🔔 Requests"}
          </h2>
        </div>
        <div className="header-right">
          <span className="user-id">ID: {userId}</span>
          <div className="bell" onClick={() => setView("requests")}>
            🔔
            <span className="badge">2</span>
          </div>../
        </div>
      </header>

      {/* Main Content */}
      <main className="community-main">
        {view === "menu" && (
          <div className="menu-options">
            <h3>Communities</h3>
            <button onClick={() => setView("group")}>👥 SnoRelax Global</button>
            <button onClick={() => setView("group")}>💚 Wellness Circle</button>
            <button onClick={() => setView("group")}>🎶 Chill & Vibes</button>

            <h3>Chats</h3>
            <button onClick={() => setView("personal")}>💬 Personal Chat</button>

            <h3>Host Tools</h3>
            <button onClick={() => alert("Community creation flow here")}>
              ➕ Create Community
            </button>
          </div>
        )}

        {view === "group" && (
          <div className="chat-area">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble ${msg.self ? "self" : "other"}`}
              >
                {!msg.self && <span className="sender">{msg.sender}</span>}
                <p>{msg.text}</p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}

        {view === "personal" && (
          <div className="chat-area">
            <p className="system-msg">
              ⚡ You can only chat after sending/accepting a request.
            </p>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble ${msg.self ? "self" : "other"}`}
              >
                {!msg.self && <span className="sender">{msg.sender}</span>}
                <p>{msg.text}</p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}

        {view === "requests" && (
          <div className="requests">
            <div className="request-card">
              <span>John wants to connect 💬</span>
              <button
                onClick={() => {
                  setSelectedChat("John");
                  setView("personal");
                }}
              >
                Accept
              </button>
            </div>
            <div className="request-card">
              <span>Emily sent a request 💌</span>
              <button
                onClick={() => {
                  setSelectedChat("Emily");
                  setView("personal");
                }}
              >
                Accept
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Input bar (only visible in chats) */}
      {(view === "group" || view === "personal") && (
        <footer className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend}>Send</button>
        </footer>
      )}
    </div>
  );
}
