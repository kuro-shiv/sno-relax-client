const API_BASE = "https://sno-relax-server-hostside.onrender.com"; // 🔗 Render backend

// ========== Auth & Chat ==========
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

// ========== Mood Tracker ==========
export async function addMood(userId, mood) {
  const res = await fetch(`${API_BASE}/api/moods`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, mood }),
  });
  return res.json();
}

export async function getMoods(userId) {
  const res = await fetch(`${API_BASE}/api/moods/${userId}`);
  return res.json();
}
