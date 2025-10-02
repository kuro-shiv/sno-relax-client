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

  // ---------------- Auto-scroll ----------------
  useEffect(() => {
    if (!messagesEndRef.current) return;
    const chatWindow = messagesEndRef.current.parentNode;
    chatWindow.scrollTop = chatWindow.scrollHeight - chatWindow.clientHeight - 20;
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
      handleSend(transcript, true); // true = mic triggered
    };

    recognition.onend = () => setListening(false);
  };

  // ---------------- Send Message ----------------
  const handleSend = async (msg = input, isMic = false) => {
    if (!msg.trim()) return;

    const lowerMsg = msg.toLowerCase();

    // -------- Repeat logic --------
    if (lowerMsg.includes("repeat") || lowerMsg.includes("say it again")) {
      const lastBot = [...messages].reverse().find(m => m.sender === "bot");
      if (lastBot) {
        const voices = speechSynthesis.getVoices();
        const indianFemale = voices.find(
          v => v.lang.startsWith("en-IN") && v.name.toLowerCase().includes("female")
        );
        const utter = new SpeechSynthesisUtterance(lastBot.text);
        if (indianFemale) utter.voice = indianFemale;
        utter.lang = "en-IN";
        speechSynthesis.speak(utter);
      }
      return; // don’t send to backend
    }

    setMessages(prev => [...prev, { sender: "user", text: msg }]);
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

        // -------- Mic-triggered TTS --------
        if (isMic) {
          const voices = speechSynthesis.getVoices();
          const indianFemale = voices.find(
            v => v.lang.startsWith("en-IN") && v.name.toLowerCase().includes("female")
          );
          const utter = new SpeechSynthesisUtterance(data.text);
          if (indianFemale) utter.voice = indianFemale;
          utter.lang = "en-IN";
          speechSynthesis.speak(utter);
        }
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
    <div className="chat-fullscreen">
      <div className="chat-window">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            <div className="bubble">{msg.text}</div>
          </div>
        ))}

        {loading && (
          <div className="message bot">
            <div className="typing-indicator">
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
    </div>
  );
}
