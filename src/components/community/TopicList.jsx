import React from "react";

const MOCK_TOPICS = [
  {
    id: "t1",
    title: "Mindfulness & Breathwork",
    description: "Short guided breathing exercises and grounding prompts.",
  },
  {
    id: "t2",
    title: "Sleep Hygiene",
    description: "Practical tips and reflections for better sleep.",
  },
  {
    id: "t3",
    title: "Managing Stress",
    description: "Micro-practices to reduce stress in the moment.",
  },
];

export default function TopicList({ onSelect, selected }) {
  return (
    <div>
      {MOCK_TOPICS.map((t) => (
        <div
          key={t.id}
          onClick={() => onSelect(t)}
          style={{
            padding: 10,
            borderRadius: 6,
            cursor: "pointer",
            background: selected?.id === t.id ? "#f0f8ff" : "transparent",
            marginBottom: 8,
          }}
        >
          <strong>{t.title}</strong>
          <div style={{ fontSize: 13, color: "#555" }}>{t.description}</div>
        </div>
      ))}
    </div>
  );
}
