import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../styles/MoodTracker.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// ✅ Mood scale (same as backend & design)
const moods = [
  { emoji: "😄", label: "Happy", value: 5 },
  { emoji: "🙂", label: "Good", value: 4 },
  { emoji: "😐", label: "Neutral", value: 3 },
  { emoji: "😴", label: "Tired", value: 2 },
  { emoji: "😡", label: "Angry", value: 1 },
  { emoji: "😢", label: "Sad", value: 0 },
];

export default function MoodTracker() {
  const [moodData, setMoodData] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Use same ID as Profile.jsx
  const userId = localStorage.getItem("sno_userId") || "";
  const apiBase = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  // ✅ Fetch moods for this user
  useEffect(() => {
    const fetchMoods = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const res = await axios.get(`${apiBase}/api/moods/${userId}`);
        if (res.data.ok) {
          setMoodData(res.data.moods);
        }
      } catch (err) {
        console.error("❌ Failed to fetch moods:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMoods();
  }, [userId, apiBase]);

  // ✅ Add a new mood entry
  const handleMoodClick = async (mood) => {
    if (!userId) {
      alert("Please log in to track your mood!");
      return;
    }
    setSelectedMood(mood.label);
    try {
      const res = await axios.post(`${apiBase}/api/moods/${userId}`, {
        mood: mood.value,
      });
      if (res.data.ok) {
        setMoodData((prev) => [...prev, res.data.entry]);
      }
    } catch (err) {
      console.error("❌ Error saving mood:", err);
    }
  };

  // ✅ Map mood numeric → emoji
  const getEmojiForMood = (value) => {
    const match = moods.find((m) => m.value === value);
    return match ? match.emoji : "❓";
  };

  // ✅ Calculate average mood
  const avgMood = (days) => {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const filtered = moodData.filter((d) => new Date(d.date) >= cutoff);
    if (!filtered.length) return "N/A";

    const avg = filtered.reduce((sum, d) => sum + d.mood, 0) / filtered.length;

    if (avg >= 4.5) return "😄 Happy";
    if (avg >= 3.5) return "🙂 Good";
    if (avg >= 2.5) return "😐 Neutral";
    if (avg >= 1.5) return "😴 Tired";
    if (avg >= 0.5) return "😡 Angry";
    return "😢 Sad";
  };

  // ✅ Chart color based on average
  const getMoodColor = () => {
    const avg = moodData.length
      ? moodData.reduce((sum, d) => sum + d.mood, 0) / moodData.length
      : 3;
    if (avg >= 4) return "#22c55e"; // green
    if (avg >= 3) return "#3b82f6"; // blue
    if (avg >= 2) return "#facc15"; // yellow
    if (avg >= 1) return "#f97316"; // orange
    return "#ef4444"; // red
  };

  // ✅ Chart.js config
  const chartData = {
    labels: moodData.map((d) =>
      new Date(d.date).toLocaleDateString("en-US", { weekday: "short" })
    ),
    datasets: [
      {
        label: "Mood Level",
        data: moodData.map((d) => d.mood),
        borderColor: getMoodColor(),
        backgroundColor: `${getMoodColor()}33`,
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  return (
    <div className="mood-tracker-container">
      <h1 className="mood-tracker-title">📊 Mood Tracker</h1>
      <p className="mood-tracker-subtitle">
        Track your emotions and visualize your weekly & monthly mood trends.
      </p>

      {/* ✅ Emoji Buttons */}
      <div className="emoji-row">
        {moods.map((m) => (
          <button
            key={m.label}
            className={`emoji-btn ${
              selectedMood === m.label ? "selected" : ""
            }`}
            onClick={() => handleMoodClick(m)}
            title={m.label}
          >
            {m.emoji}
          </button>
        ))}
      </div>

      {/* ✅ Chart */}
      <div className="chart-container">
        {loading ? (
          <p>Loading moods...</p>
        ) : moodData.length === 0 ? (
          <p>No mood data yet. Select a mood to get started!</p>
        ) : (
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (context) =>
                      `Mood: ${getEmojiForMood(context.parsed.y)} (${context.parsed.y}/5)`,
                  },
                },
                title: {
                  display: true,
                  text: "Mood Trend (Recent Entries)",
                },
              },
              scales: {
                y: {
                  min: 0,
                  max: 5,
                  ticks: {
                    stepSize: 1,
                    callback: (value) => getEmojiForMood(value),
                  },
                  title: {
                    display: true,
                    text: "Mood Level (0–5)",
                  },
                },
              },
            }}
          />
        )}
      </div>

      {/* ✅ Summary */}
      <div className="summary-section">
        <div className="summary-card">
          <h3>📅 Weekly Average</h3>
          <p>{avgMood(7)}</p>
        </div>
        <div className="summary-card">
          <h3>🗓️ Monthly Average</h3>
          <p>{avgMood(30)}</p>
        </div>
      </div>
    </div>
  );
}
