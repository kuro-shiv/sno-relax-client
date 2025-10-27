import React, { useState } from "react";

function saveReflection(userId, reflection) {
  if (!userId) return;
  const key = `sno_reflections_${userId}`;
  const cur = JSON.parse(localStorage.getItem(key) || "[]");
  cur.push(reflection);
  localStorage.setItem(key, JSON.stringify(cur));
}

export default function TopicDetail({ topic, userId }) {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("neutral");

  const handleSave = () => {
    if (!text.trim()) return;
    const r = {
      id: `r_${Date.now()}`,
      topicId: topic.id,
      topicTitle: topic.title,
      text: text.trim(),
      mood,
      createdAt: new Date().toISOString(),
    };
    saveReflection(userId, r);
    setText("");
    alert("Reflection saved privately.");
  };

  return (
    <div>
      <h2>{topic.title}</h2>
      <p style={{ color: "#555" }}>{topic.description}</p>

      <section style={{ marginTop: 16 }}>
        <h4>Guided Resource</h4>
        <div style={{ background: "#fafafa", padding: 12, borderRadius: 6 }}>
          <p>
            Short exercise: Close your eyes and breathe in for 4, hold 4, exhale 6.
            Repeat 5 times. When ready, write a short reflection below.
          </p>
        </div>
      </section>

      <section style={{ marginTop: 16 }}>
        <h4>Your private reflection</h4>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          style={{ width: "100%", padding: 8 }}
          placeholder="How was that for you? Any sensations, thoughts or feelings?"
        />

        <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
          <label>Mood:</label>
          <select value={mood} onChange={(e) => setMood(e.target.value)}>
            <option value="very_happy">Very happy</option>
            <option value="happy">Happy</option>
            <option value="neutral">Neutral</option>
            <option value="sad">Sad</option>
            <option value="stressed">Stressed</option>
          </select>

          <button onClick={handleSave} style={{ marginLeft: "auto" }}>
            Save reflection
          </button>
        </div>
      </section>
    </div>
  );
}
