import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const API = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export default function PrivateChat({ otherUserId, me }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    if (!otherUserId || !me) return;
    const load = async () => {
      try {
        const res = await axios.get(`${API}/api/community/private/${otherUserId}/messages?me=${me}`);
        setMessages(res.data.messages || []);
      } catch (e) {
        console.error(e);
      }
    };
    load();

    const socket = io(API, { transports: ["websocket"] });
    socketRef.current = socket;
    socket.emit("identify", me);
    socket.on("receivePrivateMessage", (m) => {
      // if relevant to this conversation
      if ((String(m.senderId) === String(otherUserId) && String(m.receiverId) === String(me)) || (String(m.senderId) === String(me) && String(m.receiverId) === String(otherUserId))) {
        setMessages((s) => [...s, m]);
      }
    });

    return () => socket.disconnect();
  }, [otherUserId, me]);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const send = async () => {
    if (!text.trim()) return;
    const payload = { senderId: me, receiverId: otherUserId, message: text.trim() };
    setMessages((s) => [...s, payload]);
    setText("");
    try {
      if (socketRef.current) socketRef.current.emit("sendPrivateMessage", payload);
      await axios.post(`${API}/api/community/private/message`, payload);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: 600 }}>{m.senderId?.name || (String(m.senderId) === String(me) ? "You" : "Other")}</div>
            <div style={{ background: "#fff", padding: 8, borderRadius: 8, display: "inline-block" }}>{m.message || m.text}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div style={{ padding: 8, borderTop: "1px solid #eee" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={text} onChange={(e) => setText(e.target.value)} style={{ flex: 1, padding: 8 }} onKeyDown={(e)=>e.key==="Enter"&&send()} placeholder="Type a private message" />
          <button onClick={send}>Send</button>
        </div>
      </div>
    </div>
  );
}
