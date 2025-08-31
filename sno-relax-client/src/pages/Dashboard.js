import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const savedId = localStorage.getItem("sno_userId");
    if (savedId) {
      setUserId(savedId);
    } else {
      window.location.href = "/";
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("sno_userId");
    window.location.href = "/";
  };

  // Sample mood data
  const moodData = [
    { day: "Mon", mood: 3 },
    { day: "Tue", mood: 4 },
    { day: "Wed", mood: 2 },
    { day: "Thu", mood: 5 },
    { day: "Fri", mood: 4 },
    { day: "Sat", mood: 3 },
    { day: "Sun", mood: 5 },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>📊 Sno-Relax Dashboard</h1>
        <p style={styles.subtitle}>
          Welcome! Your ID: <strong>{userId}</strong>
        </p>

        {/* Mood Tracker */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Mood Tracker</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis domain={[0, 5]} stroke="#94a3b8" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#34d399"
                strokeWidth={3}
                dot={{ r: 5, fill: "#10b981" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AI Chatbot */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🤖 AI Chatbot</h2>
          <button style={styles.btn}>Open Chatbot</button>
        </div>

        {/* Relaxation Exercises */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🧘 Relaxation Exercises</h2>
          <ul style={styles.list}>
            <li>🌬️ Deep Breathing (2 min)</li>
            <li>🎵 Meditation (5 min)</li>
            <li>🚶 Short Walk (10 min)</li>
          </ul>
        </div>

        {/* Therapist Notes */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📋 Therapist Notes</h2>
          <textarea
            placeholder="Write your notes here..."
            style={styles.textarea}
          ></textarea>
        </div>

        <button onClick={handleLogout} style={styles.logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f172a, #1e293b, #0f172a)",
    color: "white",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },
  card: {
    background: "rgba(30, 41, 59, 0.9)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "2rem",
    width: "450px",
    textAlign: "center",
    boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
  },
  title: { margin: 0, fontSize: "1.8rem", color: "#34d399" },
  subtitle: { marginBottom: "1.5rem", color: "#94a3b8" },
  section: {
    margin: "1.5rem 0",
    padding: "1rem",
    background: "#0f172a",
    borderRadius: "12px",
    border: "1px solid #334155",
    textAlign: "left",
  },
  sectionTitle: { marginBottom: "0.8rem", color: "#f3f4f6", fontSize: "1.2rem" },
  btn: {
    padding: "0.8rem 1.2rem",
    borderRadius: "10px",
    background: "linear-gradient(90deg, #34d399, #10b981)",
    color: "white",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.3s",
  },
  list: { margin: 0, paddingLeft: "1.2rem", color: "#d1d5db" },
  textarea: {
    width: "100%",
    minHeight: "80px",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #475569",
    background: "#1e293b",
    color: "white",
    resize: "none",
    fontSize: "0.95rem",
  },
  logout: {
    marginTop: "1.5rem",
    width: "100%",
    padding: "0.9rem",
    borderRadius: "10px",
    background: "linear-gradient(90deg, #f87171, #ef4444)",
    color: "white",
    border: "none",
    fontWeight: "700",
    cursor: "pointer",
    transition: "0.3s",
  },
};

export default Dashboard;
