import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../styles/MoodTracker.css";

const MoodTracker = () => {
  const [data, setData] = useState([]);
  const [note, setNote] = useState("");
  const [feedback, setFeedback] = useState("");

  // 🧠 Load saved data
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("moods") || "[]");
    setData(saved);
  }, []);

  // 💾 Save mood
  const handleAddMood = (mood) => {
    const entry = {
      date: new Date().toISOString(),
      mood,
      note,
    };
    const updated = [...data, entry];
    setData(updated);
    localStorage.setItem("moods", JSON.stringify(updated));
    setNote("");
  };

  // 📊 Prepare last 7 entries
  const last7 = data.slice(-7).map((m) => ({
    day: new Date(m.date).toLocaleDateString("en-US", { weekday: "short" }),
    mood: m.mood,
  }));

  // 📈 Weekly summary
  const avg =
    last7.length > 0
      ? (last7.reduce((sum, m) => sum + m.mood, 0) / last7.length).toFixed(1)
      : 0;

  const bestDay = last7.reduce(
    (a, b) => (b.mood > (a?.mood || 0) ? b : a),
    null
  );
  const worstDay = last7.reduce(
    (a, b) => (b.mood < (a?.mood || 6) ? b : a),
    null
  );

  // 🧭 Feedback trend
  useEffect(() => {
    if (last7.length < 3) {
      setFeedback("Keep tracking to see your weekly insights!");
      return;
    }

    const firstHalf = last7.slice(0, 3).reduce((s, m) => s + m.mood, 0) / 3;
    const lastHalf =
      last7.slice(-3).reduce((s, m) => s + m.mood, 0) / 3;

    if (lastHalf > firstHalf + 0.5)
      setFeedback("🌈 You’ve been positive lately — keep it up!");
    else if (lastHalf < firstHalf - 0.5)
      setFeedback("💤 Looks like a tough week — take time to rest.");
    else setFeedback("⚖️ Your mood’s been stable this week!");
  }, [data]);

  return (
    <div className="mood-tracker">
      <h2>🧭 Track Your Mood</h2>

      {/* Input */}
      <div className="mood-input">
        <div className="emoji-row">
          {[1, 2, 3, 4, 5].map((n, i) => (
            <button key={i} onClick={() => handleAddMood(n)}>
              {["😞", "😕", "😐", "😊", "🤩"][i]}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a short note (e.g. Work, Sleep, Family)..."
        />
      </div>

      {/* Chart */}
      <div className="chart-section">
        <h3>📊 Mood Trends (Last 7 Entries)</h3>
        {last7.length === 0 ? (
          <p style={{ color: "#888" }}>No data yet — record your first mood!</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={last7}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Summary */}
      {last7.length > 0 && (
        <div className="summary-card">
          <h3>📅 Weekly Summary</h3>
          <p>
            <strong>Average Mood:</strong> {avg} / 5
          </p>
          <p>
            <strong>Best Day:</strong> {bestDay?.day} ({bestDay?.mood}/5)
          </p>
          <p>
            <strong>Toughest Day:</strong> {worstDay?.day} ({worstDay?.mood}/5)
          </p>
          <div className="feedback">{feedback}</div>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;
