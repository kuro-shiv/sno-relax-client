// src/components/GroupList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api/community";

export default function GroupList({ onSelectGroup }) {
  const [groups, setGroups] = useState([]);
  const userId = localStorage.getItem("sno_userId") || "Guest123";

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const res = await axios.get(`${API}/groups`);
      if (res.data.ok) setGroups(res.data.groups);
    } catch (err) {
      console.error("Error fetching groups:", err);
    }
  };

  const handleJoin = async (groupId) => {
    try {
      await axios.post(`${API}/join/${groupId}`, { userId });
      loadGroups();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLeave = async (groupId) => {
    try {
      await axios.post(`${API}/leave/${groupId}`, { userId });
      loadGroups();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="group-list">
      {groups.map((g) => (
        <div key={g.id} className="group-item">
          <h4 onClick={() => onSelectGroup(g)}>{g.name}</h4>
          <p>{g.description}</p>
          {g.members.includes(userId) ? (
            <button onClick={() => handleLeave(g.id)} className="leave-btn">
              Leave
            </button>
          ) : (
            <button onClick={() => handleJoin(g.id)} className="join-btn">
              Join
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
