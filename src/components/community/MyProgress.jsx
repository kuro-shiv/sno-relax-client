import React, { useEffect, useState } from "react";

function moodLabel(m) {
  switch (m) {
    case "very_happy":
      return "😊 Very happy";
    case "happy":
      return "🙂 Happy";
    case "neutral":
      return "😐 Neutral";
    case "sad":
      return "😔 Sad";
    case "stressed":
      return "😣 Stressed";
    default:
      return m;
  }
}

export default function MyProgress({ userId }) {
  const [reflections, setReflections] = useState([]);
  const [challenges, setChallenges] = useState({});

  useEffect(() => {
    const rKey = `sno_reflections_${userId}`;
    const cKey = `sno_challenges_${userId}`;
    const r = JSON.parse(localStorage.getItem(rKey) || "[]");
    const c = JSON.parse(localStorage.getItem(cKey) || "{}");
    setReflections(r.reverse().slice(0, 10));
    setChallenges(c);
  }, [userId]);

  return (
    <div>
      <h4>Your progress</h4>
      <div style={{ marginBottom: 12 }}>
        <strong>Recent reflections</strong>
        {reflections.length === 0 && <div style={{ color: "#666" }}>No reflections yet</div>}
        {reflections.map((r) => (
          <div key={r.id} style={{ padding: 8, borderRadius: 6, background: "#fff", marginTop: 8 }}>
            <div style={{ fontSize: 13 }}>{r.topicTitle}</div>
            <div style={{ fontSize: 12, color: "#333" }}>{r.text.slice(0, 120)}{r.text.length>120?"...":""}</div>
            <div style={{ fontSize: 12, color: "#666" }}>{moodLabel(r.mood)} · {new Date(r.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div>
        <strong>Challenges completed</strong>
        <div style={{ fontSize: 13, color: "#333", marginTop: 8 }}>
          {Object.keys(challenges).filter((k) => challenges[k]).length} completed
        </div>
      </div>
    </div>
  );
}
