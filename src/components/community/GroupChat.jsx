import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const API = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export default function GroupChat({ group, userId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!group) return;
    const load = async () => {
      try {
        const res = await axios.get(`${API}/api/community/group/${group._id}/messages`);
        setMessages(res.data.messages || []);
        scrollToBottom();
      } catch (e) {
        console.error(e);
      }
    };
    load();

    // setup socket
    const socket = io(API, { transports: ["websocket"] });
    socketRef.current = socket;
    socket.emit("joinGroup", group._id);
    socket.on("receiveGroupMessage", (m) => {
      if (String(m.groupId) === String(group._id)) setMessages((s) => [...s, m]);
    });
    socket.on("messageDeleted", ({ messageId }) => {
      setMessages((s) => s.filter((m) => String(m._id || m.id) !== String(messageId)));
    });
    socket.on("typing", (payload) => {
      if (payload.groupId === group._id) setTyping(payload.typing);
    });

    return () => {
      socket.emit("leaveGroup", group._id);
      socket.disconnect();
    };
  }, [group]);

  useEffect(() => scrollToBottom(), [messages]);

  function scrollToBottom() {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const send = async () => {
    if (!text.trim()) return;
    const payload = { groupId: group._id, senderId: userId, message: text.trim() };
    // optimistic UI
    setMessages((s) => [...s, { ...payload, senderId: { _id: userId, name: "You" } }]);
    setText("");
    try {
      // emit over socket
      if (socketRef.current) socketRef.current.emit("sendGroupMessage", payload);
  // also POST to REST to be consistent
  await axios.post(`${API}/api/community/group/${group._id}/message`, payload);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: 12, background: "#fafafa" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: "600" }}>{m.senderId?.name || m.senderId}</div>
            <div style={{ background: "#fff", padding: 8, borderRadius: 8, display: "inline-block" }}>{m.message || m.text || m.message}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div style={{ padding: 8, borderTop: "1px solid #eee" }}>
        {typing && <div style={{ fontSize: 12, color: "#666" }}>Someone is typing...</div>}
        <div style={{ display: "flex", gap: 8 }}>
          <input value={text} onChange={(e) => setText(e.target.value)} style={{ flex: 1, padding: 8 }} onKeyDown={(e)=>e.key==="Enter"&&send()} placeholder="Type a message" />
          <button onClick={send}>Send</button>
        </div>
      </div>
    </div>
  );
}
