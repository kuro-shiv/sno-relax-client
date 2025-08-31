// src/pages/MoodTrackerPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import MoodTracker from "../components/MoodTracker";

const MoodTrackerPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page">
      <h1>😃 Mood Tracker</h1>
      <MoodTracker />
      <button onClick={() => navigate("/dashboard")} className="btn">
        ⬅ Back to Dashboard
      </button>
    </div>
  );
};

export default MoodTrackerPage;
