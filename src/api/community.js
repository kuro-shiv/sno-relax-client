import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/community";

// -------------------- Groups --------------------

// Fetch all community groups
export const fetchGroups = async () => {
  try {
    const res = await axios.get(`${API_URL}/groups`);
    return { ok: true, groups: res.data };
  } catch (err) {
    console.error("Error fetching groups:", err);
    return { ok: false, groups: [] };
  }
};

// Join a group
export const joinGroup = async (groupId, userId) => {
  try {
    await axios.post(`${API_URL}/join`, { groupId, userId });
    return { ok: true };
  } catch (err) {
    console.error("Error joining group:", err);
    return { ok: false };
  }
};

// Leave a group
export const leaveGroup = async (groupId, userId) => {
  try {
    await axios.post(`${API_URL}/leave`, { groupId, userId });
    return { ok: true };
  } catch (err) {
    console.error("Error leaving group:", err);
    return { ok: false };
  }
};

// -------------------- Messages --------------------

// Fetch messages of a group
export const fetchMessages = async (groupId) => {
  try {
    const res = await axios.get(`${API_URL}/messages/${groupId}`);
    return { ok: true, messages: res.data };
  } catch (err) {
    console.error("Error fetching messages:", err);
    return { ok: false, messages: [] };
  }
};

// Send a message to a group
export const sendMessage = async (groupId, messageData) => {
  try {
    await axios.post(`${API_URL}/messages/${groupId}`, messageData);
    return { ok: true };
  } catch (err) {
    console.error("Error sending message:", err);
    return { ok: false };
  }
};
