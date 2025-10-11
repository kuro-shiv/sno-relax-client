// src/components/GroupChat.jsx
import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";
let socket;

export default function GroupChat({ group }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const userId = localStorage.getItem("sno_userId") || "Guest123";
  const endRef = useRef(null);

  useEffect(() => {
    socket = io(SOCKET_URL);

    socket.emit("joinGroup", group.id);

    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit("leaveGroup", group.id);
      socket.disconnect();
    };
  }, [group.id]);

  const handleSend = () => {
    if (!text.trim()) return;
    const message = { userId, text, groupId: group.id, date: new Date() };
    socket.emit("sendMessage", { groupId: group.id, message });
    setMessages((prev) => [...prev, message]);
    setText("");
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`chat-bubble ${m.userId === userId ? "self" : "other"}`}
          >
            {!m.self && <span className="sender">{m.userId}</span>}
            <p>{m.text}</p>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
