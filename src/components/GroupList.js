import React from "react";

export default function GroupList({ groups, userId, onSelectGroup, onJoin, onLeave }) {
  return (
    <div>
      <h2 style={{ color: "#fff", marginBottom: "16px" }}>Communities</h2>
      {groups.map((g) => (
        <div key={g.id} style={{ marginBottom: "12px", background: "#262626", padding: "10px", borderRadius: "8px" }}>
          <h3 style={{ color: "#34d399", cursor: "pointer" }} onClick={() => onSelectGroup(g)}>
            {g.name}
          </h3>
          <p style={{ color: "#aaa" }}>{g.description}</p>
          {g.members.includes(userId) ? (
            <button onClick={() => onLeave(g.id)} style={{ color: "#ef4444" }}>Leave</button>
          ) : (
            <button onClick={() => onJoin(g.id)} style={{ color: "#34d399" }}>Join</button>
          )}
        </div>
      ))}
    </div>
  );
}
