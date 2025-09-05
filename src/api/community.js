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
