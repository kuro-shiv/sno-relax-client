import React, { useEffect, useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export default function NoticeBoard() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/api/community/announcements`);
        setAnnouncements(res.data.announcements || []);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h4>Notice Board</h4>
      {announcements.length === 0 && <div style={{ color: "#666" }}>No announcements</div>}
      {announcements.map((a) => (
        <div key={a._id} style={{ padding: 12, borderRadius: 8, background: "#fff", marginBottom: 8 }}>
          <div style={{ fontWeight: 700 }}>{a.title}</div>
          <div style={{ color: "#444" }}>{a.description}</div>
          {a.location && <div style={{ fontSize: 12, color: "#666" }}>📍 {a.location}</div>}
          {a.dateTime && <div style={{ fontSize: 12, color: "#666" }}>🗓️ {new Date(a.dateTime).toLocaleString()}</div>}
        </div>
      ))}
    </div>
  );
}
