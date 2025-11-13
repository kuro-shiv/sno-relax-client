import React, { useState, useEffect, useRef } from "react";
import "../styles/Chatbot.css";

const storedUserId = localStorage.getItem("sno_userId") || "guest";

export default function Chatbot({ lang = "auto", userId = storedUserId }) {
  const [messages, setMessages] = useState([]);
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ---------------- Fetch previous chats ----------------
  // useEffect(() => {
  //   const fetchHistory = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await fetch(`${API_BASE}/api/chat/history?userId=${userId}`);
  //       const data = await res.json();

  //       if (Array.isArray(data)) {
  //         const formatted = data.flatMap((chat) => [
  //           { sender: "user", text: chat.userMessage },
  //           { sender: "bot", text: chat.botReply },
  //         ]);

  //         setMessages(
  //           formatted.length
  //             ? formatted
  //             : [{ sender: "bot", text: "Hello! I'm SnoBot 🌱 How are you feeling today?" }]
  //         );
  //       }
  //     } catch (err) {
  //       console.error("Error fetching chat history:", err);
  //       setMessages([
  //         { sender: "bot", text: "Hello! I'm SnoBot 🌱 How are you feeling today?" },
  //       ]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchHistory();
  // }, [userId, API_BASE]);

  // ---------------- GOOGLE FREE TRANSLATOR ----------------

  const googleTranslate = async (text, from, to) => {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(
        text
      )}`;

      const res = await fetch(url);
      const data = await res.json();

      let translated = "";
      data[0].forEach((chunk) => (translated += chunk[0]));

      return translated;
    } catch (err) {
      console.error("Google Translate Error:", err);
      return text;
    }
  };

  const translateToEnglish = (text) =>
    lang === "en" ? text : googleTranslate(text, lang, "en");

  const translateFromEnglish = (text) =>
    lang === "en" ? text : googleTranslate(text, "en", lang);

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
      const english = await translateToEnglish(transcript);
      handleSend(english, true, transcript);
    };

    recognition.onerror = (err) => {
      console.error("Voice recognition error:", err);
      setListening(false);
    };

    recognition.onend = () => setListening(false);
  };

  // ---------------- Send Message ----------------
  const handleSend = async (msg = input, isMic = false, originalSpeech = null) => {
    if (!msg.trim()) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: originalSpeech || (lang === "en" ? msg : msg) },
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          message: msg,
          lang,
        }),
      });

      const data = await res.json();

      if (data.text) {
        const finalText = await translateFromEnglish(data.text);

        setMessages((prev) => [...prev, { sender: "bot", text: finalText }]);

        // Voice output
        if (isMic) {
          const utter = new SpeechSynthesisUtterance(finalText);
          utter.lang = lang === "auto" ? "en-IN" : lang;
          speechSynthesis.cancel();
          speechSynthesis.speak(utter);
        }
      } else {
        setMessages((prev) => [...prev, { sender: "bot", text: "⚠️ No response from server." }]);
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
