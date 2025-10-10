import React, { useEffect, useState, useRef } from "react";
import { fetchMessages, sendMessage } from "../api/community";

export default function GroupChat({ group, userId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (group) {
      loadMessages();
      const interval = setInterval(loadMessages, 5000); // poll messages
      return () => clearInterval(interval);
    }
  }, [group]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadMessages() {
    const res = await fetchMessages(group.id);
    if (res.ok) setMessages(res.messages);
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    await sendMessage(group.id, { userId, text });
    setText("");
    loadMessages();
  }

  if (!group) return <p style={{ color: "#888" }}>Select a group to start chatting</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", marginBottom: "12px" }}>
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              background: m.userId === userId ? "#34d399" : "#262626",
              color: m.userId === userId ? "#000" : "#fff",
              alignSelf: m.userId === userId ? "flex-end" : "flex-start",
              padding: "8px 12px",
              borderRadius: "12px",
              margin: "4px 0",
              maxWidth: "70%",
            }}
          >
            <small style={{ opacity: 0.7 }}>{m.userId === userId ? "You" : m.userId}</small>
            <p>{m.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} style={{ display: "flex", gap: "8px" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: "10px", borderRadius: "20px", background: "#262626", color: "#fff", border: "none" }}
        />
        <button type="submit" style={{ padding: "10px 16px", background: "#34d399", color: "#000", fontWeight: "bold", borderRadius: "20px" }}>
          Send
        </button>
      </form>
    </div>
  );
}
