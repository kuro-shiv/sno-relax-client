import React, { useState, useEffect, useRef } from "react";
import "../styles/Chatbot.css";

// ✅ Get userId safely from localStorage
const storedUserId = localStorage.getItem("sno_userId") || "guest";

export default function Chatbot({ lang = "auto", userId = storedUserId }) {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I'm SnoBot 🌱 How are you feeling today?" },
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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  // ---------------- Voice Recognition ----------------
  const handleVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice recognition not supported!");

    const recognition = new SpeechRecognition();
    recognition.lang = lang === "auto" ? "en-IN" : lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true);
    recognition.start();

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      const translatedToEnglish = await translateToEnglish(transcript);
      handleSend(translatedToEnglish, true, transcript); // mic=true
    };

    recognition.onerror = (err) => {
      console.error("Voice recognition error:", err);
      setListening(false);
    };

    recognition.onend = () => setListening(false);
  };

  // ---------------- Translation Helpers ----------------
  const translateToEnglish = async (text) => {
    if (lang === "en") return text;
    try {
      const res = await fetch(`${API_BASE}/api/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, from: lang, to: "en" }),
      });
      const data = await res.json();
      return data.translated || text;
    } catch (err) {
      console.error("Translation error (to English):", err);
      return text;
    }
  };

  const translateFromEnglish = async (text) => {
    if (lang === "en") return text;
    try {
      const res = await fetch(`${API_BASE}/api/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, from: "en", to: lang }),
      });
      const data = await res.json();
      return data.translated || text;
    } catch (err) {
      console.error("Translation error (from English):", err);
      return text;
    }
  };

  // ---------------- Send Message ----------------
  const handleSend = async (msg = input, isMic = false, originalSpeech = null) => {
    if (!msg.trim()) return;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: originalSpeech || msg },
    ]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          message: msg, // English text
          lang,
        }),
      });

      const data = await res.json();

      if (data.text) {
        const translatedResponse = await translateFromEnglish(data.text);

        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: translatedResponse },
        ]);

        // ✅ Speak response only if mic used
        if (isMic) {
          const utter = new SpeechSynthesisUtterance(translatedResponse);
          utter.lang = lang === "auto" ? "en-IN" : lang;
          speechSynthesis.cancel(); // stop any ongoing speech
          speechSynthesis.speak(utter);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "⚠️ No response from server." },
        ]);
      }
    } catch (err) {
      console.error("Chat send error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Couldn’t connect to the server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI ----------------
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
              <span></span>
              <span></span>
              <span></span>
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
