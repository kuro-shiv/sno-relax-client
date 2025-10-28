import React, { useEffect, useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export default function GroupList({ onSelect, selected, onJoin }) {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/api/community/groups`);
        setGroups(res.data.groups || []);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  return (
    <div>
      {groups.map((g) => (
        <div
          key={g._id}
          onClick={() => onSelect(g)}
          style={{
            padding: 10,
            borderRadius: 6,
            cursor: "pointer",
            background: selected?._id === g._id ? "#f0f8ff" : "transparent",
            marginBottom: 8,
          }}
        >
          <strong>{g.name}</strong>
          <div style={{ fontSize: 13, color: "#555" }}>{g.description}</div>
        </div>
      ))}
    </div>
  );
}
