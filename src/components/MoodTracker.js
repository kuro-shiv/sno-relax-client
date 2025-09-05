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
import { addMood, getMoods } from "../api";
import "../styles/MoodTracker.css";

const MoodTracker = () => {
  const [data, setData] = useState([]);
  const userId = localStorage.getItem("sno_userId");

  // Fetch moods when page loads
  useEffect(() => {
    if (!userId) return;
    getMoods(userId).then((res) => {
      if (res.ok) {
        const chartData = res.moods.map((m) => ({
          day: new Date(m.date).toLocaleDateString("en-US", {
            weekday: "short",
          }),
          mood: m.mood,
        }));
        setData(chartData);
      }
    });
  }, [userId]);

  // Add mood entry
  const handleAddMood = async (mood) => {
    const res = await addMood(userId, mood);
    if (res.ok) {
      setData((prev) => [
        ...prev,
        {
          day: new Date(res.entry.date).toLocaleDateString("en-US", {
            weekday: "short",
          }),
          mood: res.entry.mood,
        },
      ]);
    }
  };

  return (
    <div className="mood-tracker">
      <h2>Track Your Mood</h2>

      {/* Mood input (emoji buttons) */}
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
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis domain={[0, 5]} />
          <Tooltip />
          <Line type="monotone" dataKey="mood" stroke="#3b82f6" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodTracker;
