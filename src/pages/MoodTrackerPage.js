// src/pages/MoodTrackerPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import MoodTracker from "../components/MoodTracker";
import "../styles/MoodTrackerPage.css";

const MoodTrackerPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page mood-tracker-page">
      <h1>📊 Mood Tracker</h1>
      <p className="subtitle">Track your daily emotions and visualize your mood trends.</p>
      <MoodTracker />
      <button onClick={() => navigate("/dashboard")} className="btn back-btn">
        ⬅ Back to Dashboard
      </button>
    </div>
  );
};

export default MoodTrackerPage;
