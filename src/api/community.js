const API_BASE = "https://sno-relax-server-hostside.onrender.com"; // ✅ your Render backend

// Get all groups
export async function fetchGroups() {
  const res = await fetch(`${API_BASE}/api/community/groups`);
  return res.json();
}

// Create group
export async function createGroup(data) {
  const res = await fetch(`${API_BASE}/api/community/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Join group
export async function joinGroup(groupId, userId) {
  const res = await fetch(`${API_BASE}/api/community/join/${groupId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  return res.json();
}

// Leave group
export async function leaveGroup(groupId, userId) {
  const res = await fetch(`${API_BASE}/api/community/leave/${groupId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  return res.json();
}

// Send message
export async function sendMessage(groupId, data) {
  const res = await fetch(`${API_BASE}/api/community/${groupId}/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Get messages
export async function fetchMessages(groupId) {
  const res = await fetch(`${API_BASE}/api/community/${groupId}/messages`);
  return res.json();
}

// Chatbot interaction
export async function chatWithBot(input) {
  const res = await fetch("http://localhost:5000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: input }),
  });
  return res.json();
}

function Chatbot() {
  // ...existing code...

  const API_BASE =
    process.env.NODE_ENV === "production"
      ? "https://sno-relax-server-hostside.onrender.com"
      : "http://localhost:5000";

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
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
  // ...existing code...
}
