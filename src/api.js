// src/api.js
const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://sno-relax-server-hostside.onrender.com"
    : "http://localhost:5000";

export async function createUser(data) {
  const res = await fetch(`${API_BASE}/api/create-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function login(userId) {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  return res.json();
}

export async function chat(message) {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  return res.json();
}

export async function getMoods(userId) {
  const res = await fetch(
    `${
      process.env.NODE_ENV === "production"
        ? "https://sno-relax-server-hostside.onrender.com"
        : "http://localhost:5000"
    }/api/moods?userId=${userId}`
  );
  return res.json();
}

export async function addMood(userId, mood) {
  const res = await fetch(
    `${
      process.env.NODE_ENV === "production"
        ? "https://sno-relax-server-hostside.onrender.com"
        : "http://localhost:5000"
    }/api/moods`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, mood }),
    }
  );
  return res.json();
}

function Chatbot() {
  // ...existing code...

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      if (data.text) {
        setMessages((prev) => [...prev, { sender: "bot", text: data.text }]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Sorry, I couldn’t connect to the server." },
      ]);
    }

    setInput("");
  };
}
