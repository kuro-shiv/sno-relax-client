// src/api.js
import { API_ENDPOINTS, API_BASE, SOCKET_URL } from "./config/api.config";
import { io } from "socket.io-client";

// ==================== AUTH ====================
export async function createUser(data) {
  const res = await fetch(API_ENDPOINTS.AUTH.CREATE_USER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Auth Error: ${res.status}`);
  return res.json();
}

export async function login(userId) {
  const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error(`Auth Error: ${res.status}`);
  return res.json();
}

// ==================== CHAT ====================
export async function chat(message, userId, lang = "en", persona = "snobot") {
  const res = await fetch(API_ENDPOINTS.CHAT.SEND_MESSAGE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ message, userId, lang, persona }),
  });
  if (!res.ok) throw new Error(`Chat Error: ${res.status}`);
  return res.json();
}

export async function getChatHistory(userId) {
  const res = await fetch(`${API_ENDPOINTS.CHAT.GET_HISTORY}?userId=${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw new Error(`History Error: ${res.status}`);
  return res.json();
}

// ==================== COMMUNITY - GROUPS ====================
export async function getGroups() {
  const res = await fetch(API_ENDPOINTS.COMMUNITY.GET_GROUPS, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Groups Error: ${res.status}`);
  return res.json();
}

export async function createGroup(data) {
  const res = await fetch(API_ENDPOINTS.COMMUNITY.CREATE_GROUP, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Create Group Error: ${res.status}`);
  return res.json();
}

export async function deleteGroup(id) {
  const res = await fetch(API_ENDPOINTS.COMMUNITY.DELETE_GROUP(id), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Delete Group Error: ${res.status}`);
  return res.json();
}

export async function getGroupMessages(groupId) {
  const res = await fetch(API_ENDPOINTS.COMMUNITY.GET_GROUP_MESSAGES(groupId), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Group Messages Error: ${res.status}`);
  return res.json();
}

export async function postGroupMessage(groupId, data) {
  const res = await fetch(API_ENDPOINTS.COMMUNITY.POST_GROUP_MESSAGE(groupId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Post Message Error: ${res.status}`);
  return res.json();
}

export async function joinGroup(groupId, userId, nickname) {
  const res = await fetch(API_ENDPOINTS.COMMUNITY.JOIN_GROUP(groupId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ userId, nickname }),
  });
  if (!res.ok) throw new Error(`Join Group Error: ${res.status}`);
  return res.json();
}

export async function leaveGroup(groupId, userId) {
  const res = await fetch(API_ENDPOINTS.COMMUNITY.LEAVE_GROUP(groupId), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error(`Leave Group Error: ${res.status}`);
  return res.json();
}

export async function deleteMessage(messageId, userId) {
  const res = await fetch(API_ENDPOINTS.COMMUNITY.DELETE_MESSAGE(messageId), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error(`Delete Message Error: ${res.status}`);
  return res.json();
}

export async function updateNickname(userId, nickname) {
  const res = await fetch(API_ENDPOINTS.COMMUNITY.UPDATE_NICKNAME(userId), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ nickname }),
  });
  if (!res.ok) throw new Error(`Update Nickname Error: ${res.status}`);
  return res.json();
}

export async function getNickname(userId) {
  const res = await fetch(API_ENDPOINTS.COMMUNITY.GET_NICKNAME(userId), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Get Nickname Error: ${res.status}`);
  return res.json();
}

// ==================== MOODS ====================
export async function getMoods(userId) {
  const res = await fetch(`${API_ENDPOINTS.MOODS.GET_MOODS}?userId=${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Moods Error: ${res.status}`);
  return res.json();
}

export async function addMood(userId, mood, notes = "") {
  const res = await fetch(API_ENDPOINTS.MOODS.ADD_MOOD, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ userId, mood, notes }),
  });
  if (!res.ok) throw new Error(`Add Mood Error: ${res.status}`);
  return res.json();
}

// ==================== SOCKET.IO ====================
export function createSocket() {
  return io(SOCKET_URL, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });
}

export default {
  createUser,
  login,
  chat,
  getChatHistory,
  getGroups,
  createGroup,
  deleteGroup,
  getGroupMessages,
  postGroupMessage,
  joinGroup,
  leaveGroup,
  deleteMessage,
  updateNickname,
  getNickname,
  getMoods,
  addMood,
  createSocket,
  API_BASE,
};

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
