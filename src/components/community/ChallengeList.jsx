import React, { useEffect, useState } from "react";

const MOCK_CHALLENGES = [
  { id: "c1", title: "2-minute breathing", description: "Try a 2-minute breathing exercise today." },
  { id: "c2", title: "No-screen before bed", description: "Avoid screens 30 minutes before sleep." },
  { id: "c3", title: "Gratitude note", description: "Write one thing you're grateful for." },
];

export default function ChallengeList({ userId }) {
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const key = `sno_challenges_${userId}`;
    const cur = JSON.parse(localStorage.getItem(key) || "{}");
    setProgress(cur);
  }, [userId]);

  const toggle = (id) => {
    const key = `sno_challenges_${userId}`;
    const cur = JSON.parse(localStorage.getItem(key) || "{}");
    cur[id] = !cur[id];
    localStorage.setItem(key, JSON.stringify(cur));
    setProgress(cur);
  };

  return (
    <div>
      <h4>Challenges</h4>
      {MOCK_CHALLENGES.map((c) => (
        <div key={c.id} style={{ padding: 8, borderRadius: 6, marginBottom: 8, background: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <strong>{c.title}</strong>
              <div style={{ fontSize: 12, color: "#666" }}>{c.description}</div>
            </div>
            <div>
              <button onClick={() => toggle(c.id)}>{progress[c.id] ? "Completed" : "Mark"}</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
