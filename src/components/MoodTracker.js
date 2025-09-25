// src/components/MoodTracker.js
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

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const MoodTracker = () => {
  const [data, setData] = useState([]);
  const userId = localStorage.getItem("sno_userId");

  // Fetch moods
  useEffect(() => {
    if (!userId) return;

    fetch(`${API_BASE}/moodtracker/${userId}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.ok) {
          const chartData = res.moods.map((m) => ({
            day: new Date(m.date).toLocaleDateString("en-US", { weekday: "short" }),
            mood: m.mood,
          }));
          setData(chartData);
        }
      })
      .catch(console.error);
  }, [userId]);

  // Add mood
  const handleAddMood = async (mood) => {
    if (!userId) return;

    const res = await fetch(`${API_BASE}/moodtracker/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood }),
    });
    const json = await res.json();
    if (json.ok) {
      const entry = {
        day: new Date(json.entry.date).toLocaleDateString("en-US", { weekday: "short" }),
        mood: json.entry.mood,
      };
      setData((prev) => [...prev, entry]);
    }
  };

  return (
    <div className="mood-tracker">
      <h2>Track Your Mood</h2>

      {/* Mood buttons */}
      <div className="mood-buttons">
        <button onClick={() => handleAddMood(1)}>😔</button>
        <button onClick={() => handleAddMood(2)}>😕</button>
        <button onClick={() => handleAddMood(3)}>😐</button>
        <button onClick={() => handleAddMood(4)}>😊</button>
        <button onClick={() => handleAddMood(5)}>🤩</button>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="day" stroke="#cbd5e1" />
          <YAxis domain={[0, 5]} stroke="#cbd5e1" />
          <Tooltip />
          <Line type="monotone" dataKey="mood" stroke="#3b82f6" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodTracker;
