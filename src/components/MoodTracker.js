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

// ✅ Mood scale
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

  const userId = localStorage.getItem("sno_userId") || "";
  const apiBase = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  // Fetch moods
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

  // Add new mood
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

  const getEmojiForMood = (value) => {
    const match = moods.find((m) => m.value === value);
    return match ? match.emoji : "❓";
  };

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

  const getMoodColor = () => {
    const avg = moodData.length
      ? moodData.reduce((sum, d) => sum + d.mood, 0) / moodData.length
      : 3;
    if (avg >= 4) return "#22c55e";
    if (avg >= 3) return "#3b82f6";
    if (avg >= 2) return "#facc15";
    if (avg >= 1) return "#f97316";
    return "#ef4444";
  };

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
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  return (
    <div className="mood-tracker-container">

      {/* Emojis */}
      <div className="emoji-row">
        {moods.map((m) => (
          <button
            key={m.label}
            className={`emoji-btn ${selectedMood === m.label ? "selected" : ""}`}
            onClick={() => handleMoodClick(m)}
            title={m.label}
          >
            {m.emoji}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="chart-container">
        {loading ? (
          <p>Loading...</p>
        ) : moodData.length === 0 ? (
          <p>No moods yet. Select one to start!</p>
        ) : (
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (context) =>
                      `Mood: ${getEmojiForMood(context.parsed.y)} (${context.parsed.y}/5)`,
                  },
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
                },
              },
            }}
          />
        )}
      </div>

      {/* Averages */}
      <div className="summary-section">
        <div className="summary-card">
          <h3>📅 Weekly</h3>
          <p>{avgMood(7)}</p>
        </div>
        <div className="summary-card">
          <h3>🗓️ Monthly</h3>
          <p>{avgMood(30)}</p>
        </div>
      </div>
    </div>
  );
}
