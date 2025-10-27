import React, { useState } from "react";

function saveReflection(userId, reflection) {
  if (!userId) return;
  const key = `sno_reflections_${userId}`;
  const cur = JSON.parse(localStorage.getItem(key) || "[]");
  cur.push(reflection);
  localStorage.setItem(key, JSON.stringify(cur));
}

export default function SnoBotWidget({ userId }) {
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");

  const prompts = [
    "What's one small win from today?",
    "What's one thing you can let go of right now?",
    "One kind thing you can do for yourself this evening?",
  ];

  const advance = () => {
    if (step < prompts.length - 1) {
      setStep(step + 1);
      setAnswer("");
    } else {
      // finish and store as a reflection
      const r = {
        id: `r_bot_${Date.now()}`,
        topicId: "sno-bot",
        topicTitle: "SnoBot reflection",
        text: answer || "",
        mood: "neutral",
        createdAt: new Date().toISOString(),
      };
      saveReflection(userId, r);
      setStep(0);
      setAnswer("");
      alert("SnoBot reflection saved privately.");
    }
  };

  return (
    <div>
      <h4>SnoBot (guided)</h4>
      <div style={{ background: "#f7fbff", padding: 12, borderRadius: 6 }}>
        <div style={{ marginBottom: 8, color: "#222" }}>{prompts[step]}</div>
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your short response"
          style={{ width: "100%", padding: 8 }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
          <button onClick={advance}>{step < prompts.length - 1 ? "Next" : "Finish"}</button>
        </div>
      </div>
    </div>
  );
}
