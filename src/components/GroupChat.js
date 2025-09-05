import React, { useEffect, useState, useRef } from "react";
import { fetchMessages, sendMessage } from "../api/community";

export default function GroupChat({ group, userId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (group) {
      loadMessages();
      const interval = setInterval(loadMessages, 5000); // poll every 5s
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

  if (!group) {
    return (
      <div className="flex items-center justify-center flex-1 bg-gray-900 rounded-lg">
        <p className="text-gray-400">👥 Select a group to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-3 border-b border-gray-800">
        <h2 className="text-lg font-bold text-blue-400">{group.name}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-2 rounded max-w-lg ${
              m.userId === userId
                ? "ml-auto bg-blue-600 text-white"
                : "mr-auto bg-gray-700 text-gray-100"
            }`}
          >
            <span className="block text-xs text-gray-300">
              {m.userId === userId ? "You" : m.userId}
            </span>
            <span>{m.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-gray-800 flex"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-700 text-white"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="ml-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}
