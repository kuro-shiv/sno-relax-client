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

const moods = [
  { emoji: "😄", label: "Happy", value: 5 },
  { emoji: "🙂", label: "Good", value: 4 },
  { emoji: "😐", label: "Neutral", value: 3 },
  { emoji: "🙁", label: "Sad", value: 2 },
  { emoji: "😢", label: "Very Sad", value: 1 },
];

export default function MoodTracker() {
  const [moodData, setMoodData] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);

  // 👉 Replace with real user ID once you have authentication
  const userId = "6740f2a1234abcd5678ef90"; // example dummy userId

  // ✅ Fetch mood history from backend
  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const res = await axios.get(`/api/moods/${userId}`);
        if (res.data.ok) {
          setMoodData(res.data.moods);
        }
      } catch (err) {
        console.error("Failed to fetch moods:", err);
      }
    };
    fetchMoods();
  }, [userId]);

  // ✅ Handle new mood selection
  const handleMoodClick = async (mood) => {
    setSelectedMood(mood.label);
    try {
      const res = await axios.post(`/api/moods/${userId}`, {
        mood: mood.label,
      });
      if (res.data.ok) {
        setMoodData((prev) => [...prev.slice(-9), res.data.entry]);
      }
    } catch (err) {
      console.error("Error saving mood:", err);
    }
  };

  // ✅ Chart Data
  const chartData = {
    labels: moodData.map((d) =>
      new Date(d.date).toLocaleDateString("en-US", { weekday: "short" })
    ),
    datasets: [
      {
        label: "Mood Level",
        data: moodData.map((d) => {
          const mood = moods.find((m) => m.label === d.mood);
          return mood ? mood.value : 3;
        }),
        borderColor: "#3b82f6",
        backgroundColor: "#93c5fd",
        tension: 0.4,
      },
    ],
  };

  // ✅ Calculate average moods
  const avgMood = (days) => {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const filtered = moodData.filter((d) => new Date(d.date) >= cutoff);
    if (!filtered.length) return "N/A";
    const avg =
      filtered.reduce((sum, d) => {
        const mood = moods.find((m) => m.label === d.mood);
        return sum + (mood ? mood.value : 3);
      }, 0) / filtered.length;
    if (avg >= 4.5) return "😄 Excellent";
    if (avg >= 3.5) return "🙂 Good";
    if (avg >= 2.5) return "😐 Neutral";
    if (avg >= 1.5) return "🙁 Low";
    return "😢 Poor";
  };

  return (
    <div className="mood-tracker-container">
      <div className="emoji-row">
        {moods.map((m) => (
          <button
            key={m.label}
            className={`emoji-btn ${
              selectedMood === m.label ? "selected" : ""
            }`}
            onClick={() => handleMoodClick(m)}
          >
            {m.emoji}
          </button>
        ))}
      </div>

      <div className="chart-container">
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text: "Mood Trend (Recent 9–10 entries)",
              },
            },
            scales: {
              y: { min: 1, max: 5, ticks: { stepSize: 1 } },
            },
          }}
        />
      </div>

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
