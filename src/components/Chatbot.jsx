// src/components/Chatbot.jsx
import React, { useState, useEffect, useRef } from "react";
import "../styles/Chatbot.css";

export default function Chatbot({ lang }) {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I'm SnoBot your friend 🌱. How are you feeling today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const messagesEndRef = useRef(null);

  const API_BASE =
    process.env.NODE_ENV === "production"
      ? "https://sno-relax-server.onrender.com"
      : "http://localhost:5000";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ---------------- Voice Recognition ----------------
  const handleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice recognition not supported!");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setListening(true);

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
    };

    recognition.onend = () => setListening(false);
  };

  // ---------------- Send Message ----------------
  const handleSend = async (msg = input) => {
    if (!msg.trim()) return;

    const newMessages = [...messages, { sender: "user", text: msg }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, lang })
      });
      const data = await res.json();

      if (data.text) {
        setMessages(prev => [...prev, { sender: "bot", text: data.text }]);
        const utter = new SpeechSynthesisUtterance(data.text);
        utter.lang = lang === "auto" ? "en-US" : lang; // Set voice lang
        speechSynthesis.speak(utter);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "⚠️ Sorry, I couldn’t connect to the server." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="chat-window">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            <div
              className="bubble"
              ref={i === messages.length - 1 ? lastMessageRef : null}
            >
              {msg.text}
            </div>
          </div>
        ))}


        {loading && (
          <div className="message bot">
            <div
              className="bubble typing-indicator"
              style={{
                width: lastMessageRef.current
                  ? `${lastMessageRef.current.offsetWidth - 10}px`
                  : "60px"
              }}
            >
              <span></span><span></span><span></span>
            </div>
          </div>
        )}


        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <button
          className={`mic-btn ${listening ? "listening" : ""}`}
          onClick={handleVoice}
        >
          🎤
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={() => handleSend()}>➤</button>
      </div>
    </>
  );
}
