// // // src/components/Chatbot.jsx
// // import React, { useState, useEffect, useRef } from "react";
// // import "../styles/Chatbot.css";

// // export default function Chatbot({ lang }) {
// //   const [messages, setMessages] = useState([
// //     { sender: "bot", text: "Hello! I'm SnoBot your friend 🌱. How are you feeling today?" }
// //   ]);
// //   const [input, setInput] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [listening, setListening] = useState(false);
// //   const messagesEndRef = useRef(null);

// //   const API_BASE =
// //     process.env.NODE_ENV === "production"
// //       ? "https://sno-relax-server.onrender.com"
// //       : "http://localhost:5000";

// //   // ---------------- Auto-scroll ----------------
// //   useEffect(() => {
// //     if (!messagesEndRef.current) return;
// //     const chatWindow = messagesEndRef.current.parentNode;
// //     chatWindow.scrollTop = chatWindow.scrollHeight - chatWindow.clientHeight - 20;
// //   }, [messages, loading]);

// //   // ---------------- Voice Recognition ----------------
// //   const handleVoice = () => {
// //     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// //     if (!SpeechRecognition) return alert("Voice recognition not supported!");

// //     const recognition = new SpeechRecognition();
// //     recognition.lang = "en-US";
// //     recognition.interimResults = false;
// //     recognition.maxAlternatives = 1;
// //     setListening(true);

// //     recognition.start();

// //     recognition.onresult = (event) => {
// //       const transcript = event.results[0][0].transcript;
// //       setInput(transcript);
// //       handleSend(transcript, true); // true = mic triggered
// //     };

// //     recognition.onend = () => setListening(false);
// //   };

// //   // ---------------- Send Message ----------------
// //   const handleSend = async (msg = input, isMic = false) => {
// //     if (!msg.trim()) return;

// //     const lowerMsg = msg.toLowerCase();

// //     // -------- Repeat logic --------
// //     if (lowerMsg.includes("repeat") || lowerMsg.includes("say it again")) {
// //       const lastBot = [...messages].reverse().find(m => m.sender === "bot" && m.audio);
// //       if (lastBot) {
// //         const utter = new SpeechSynthesisUtterance(lastBot.text);
// //         utter.lang = lastBot.lang || "en-IN";
// //         speechSynthesis.speak(utter);
// //       }
// //       return;
// //     }

// //     // -------- Normal message --------
// //     setMessages(prev => [...prev, { sender: "user", text: msg }]);
// //     setInput("");
// //     setLoading(true);

// //     try {
// //       const res = await fetch(`${API_BASE}/api/chat`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ message: msg, lang })
// //       });
// //       const data = await res.json();

// //       if (data.text) {
// //         setMessages(prev => [
// //           ...prev,
// //           {
// //             sender: "bot",
// //             text: data.text,
// //             audio: isMic,  // mark if TTS should play
// //             lang: lang     // store user language
// //           }
// //         ]);

// //         // -------- Play TTS only for mic messages --------
// //         if (isMic) {
// //           const utter = new SpeechSynthesisUtterance(data.text);
// //           utter.lang = lang === "auto" ? "en-IN" : lang;
// //           speechSynthesis.speak(utter);
// //         }
// //       }
// //     } catch {
// //       setMessages(prev => [
// //         ...prev,
// //         { sender: "bot", text: "⚠️ Sorry, I couldn’t connect to the server." }
// //       ]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="chat-fullscreen">
// //       <div className="chat-window">
// //         {messages.map((msg, i) => (
// //           <div key={i} className={`message ${msg.sender}`}>
// //             <div className="bubble">{msg.text}</div>
// //           </div>
// //         ))}

// //         {loading && (
// //           <div className="message bot">
// //             <div className="typing-indicator">
// //               <span></span><span></span><span></span>
// //             </div>
// //           </div>
// //         )}

// //         <div ref={messagesEndRef} />
// //       </div>

// //       <div className="chat-input">
// //         <button
// //           className={`mic-btn ${listening ? "listening" : ""}`}
// //           onClick={handleVoice}
// //         >
// //           🎤
// //         </button>
// //         <input
// //           value={input}
// //           onChange={(e) => setInput(e.target.value)}
// //           placeholder="Type a message..."
// //           onKeyDown={(e) => e.key === "Enter" && handleSend()}
// //         />
// //         <button onClick={() => handleSend()}>➤</button>
// //       </div>
// //     </div>
// //   );
// // }




// import React, { useState, useEffect, useRef } from "react";
// import "../styles/Chatbot.css";

// export default function Chatbot({ lang, userId = "test123" }) {
//   const [messages, setMessages] = useState([
//     { sender: "bot", text: "Hello! I'm SnoBot 🌱 How are you feeling today?" }
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [listening, setListening] = useState(false);
//   const messagesEndRef = useRef(null);

//   const API_BASE =
//     process.env.NODE_ENV === "production"
//       ? "https://sno-relax-server.onrender.com"
//       : "http://localhost:5000";

//   // ---------------- Auto-scroll ----------------
//   useEffect(() => {
//     if (!messagesEndRef.current) return;
//     const chatWindow = messagesEndRef.current.parentNode;
//     chatWindow.scrollTop = chatWindow.scrollHeight - chatWindow.clientHeight - 20;
//   }, [messages, loading]);

//   // ---------------- Voice Recognition ----------------
//   const handleVoice = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) return alert("Voice recognition not supported!");

//     const recognition = new SpeechRecognition();
//     recognition.lang = lang || "en-IN";
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;
//     setListening(true);
//     recognition.start();

//     recognition.onresult = async (event) => {
//       const transcript = event.results[0][0].transcript;
//       const translatedToEnglish = await translateToEnglish(transcript); // convert to English first
//       handleSend(translatedToEnglish, true, transcript); // send translated msg, but store original too
//     };

//     recognition.onend = () => setListening(false);
//   };

//   // ---------------- Translation Helpers ----------------
//   // You can replace these with actual backend translation APIs later
//   const translateToEnglish = async (text) => {
//     if (lang === "en") return text;
//     // call your backend translation API
//     try {
//       const res = await fetch(`${API_BASE}/api/translate`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text, from: lang, to: "en" })
//       });
//       const data = await res.json();
//       return data.translated || text;
//     } catch {
//       return text;
//     }
//   };

//   const translateFromEnglish = async (text) => {
//     if (lang === "en") return text;
//     try {
//       const res = await fetch(`${API_BASE}/api/translate`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text, from: "en", to: lang })
//       });
//       const data = await res.json();
//       return data.translated || text;
//     } catch {
//       return text;
//     }
//   };

//   // ---------------- Send Message ----------------
//   const handleSend = async (msg = input, isMic = false, originalSpeech = null) => {
//     if (!msg.trim()) return;

//     const timestamp = new Date().toISOString();

//     setMessages(prev => [
//       ...prev,
//       { sender: "user", text: originalSpeech || msg, time: timestamp }
//     ]);
//     setInput("");
//     setLoading(true);

//     try {
//       const res = await fetch(`${API_BASE}/api/chat`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId,
//           message: msg,     // English version for backend
//           lang,
//           timestamp
//         })
//       });

//       const data = await res.json();

//       if (data.text) {
//         const translatedResponse = await translateFromEnglish(data.text); // translate back
//         const newMessage = {
//           sender: "bot",
//           text: translatedResponse,
//           original: data.text,
//           time: new Date().toISOString()
//         };

//         setMessages(prev => [...prev, newMessage]);

//         // Play TTS
//         const utter = new SpeechSynthesisUtterance(translatedResponse);
//         utter.lang = lang === "auto" ? "en-IN" : lang;
//         speechSynthesis.speak(utter);
//       }
//     } catch {
//       setMessages(prev => [
//         ...prev,
//         { sender: "bot", text: "⚠️ Sorry, I couldn’t connect to the server." }
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="chat-fullscreen">
//       <div className="chat-window">
//         {messages.map((msg, i) => (
//           <div key={i} className={`message ${msg.sender}`}>
//             <div className="bubble">
//               {msg.text}
//               <span className="time">{msg.time ? new Date(msg.time).toLocaleTimeString() : ""}</span>
//             </div>
//           </div>
//         ))}

//         {loading && (
//           <div className="message bot">
//             <div className="typing-indicator">
//               <span></span><span></span><span></span>
//             </div>
//           </div>
//         )}

//         <div ref={messagesEndRef} />
//       </div>

//       <div className="chat-input">
//         <button
//           className={`mic-btn ${listening ? "listening" : ""}`}
//           onClick={handleVoice}
//         >
//           🎤
//         </button>
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type a message..."
//           onKeyDown={(e) => e.key === "Enter" && handleSend()}
//         />
//         <button onClick={() => handleSend()}>➤</button>
//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect, useRef } from "react";
import "../styles/Chatbot.css";

export default function Chatbot({ lang = "auto", userId = "test123" }) {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I'm SnoBot 🌱 How are you feeling today?" }
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
    recognition.lang = lang || "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setListening(true);
    recognition.start();

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      const translatedToEnglish = await translateToEnglish(transcript);
      handleSend(translatedToEnglish, true, transcript); // send translated msg, store original for display
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
        body: JSON.stringify({ text, from: lang, to: "en" })
      });
      const data = await res.json();
      return data.translated || text;
    } catch {
      return text;
    }
  };

  const translateFromEnglish = async (text) => {
    if (lang === "en") return text;
    try {
      const res = await fetch(`${API_BASE}/api/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, from: "en", to: lang })
      });
      const data = await res.json();
      return data.translated || text;
    } catch {
      return text;
    }
  };

  // ---------------- Send Message ----------------
  const handleSend = async (msg = input, isMic = false, originalSpeech = null) => {
    if (!msg.trim()) return;

    // -------- Display user message --------
    setMessages(prev => [
      ...prev,
      { sender: "user", text: originalSpeech || msg }
    ]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          message: msg,   // English version for backend
          lang
        })
      });

      const data = await res.json();

      if (data.text) {
        const translatedResponse = await translateFromEnglish(data.text);

        setMessages(prev => [
          ...prev,
          { sender: "bot", text: translatedResponse }
        ]);

        // -------- TTS --------
        const utter = new SpeechSynthesisUtterance(translatedResponse);
        utter.lang = lang === "auto" ? "en-IN" : lang;
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
