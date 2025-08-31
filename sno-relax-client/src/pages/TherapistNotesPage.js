import React from "react";
import TherapistNotes from "../components/TherapistNotes";
import { useNavigate } from "react-router-dom";

export default function TherapistNotesPage() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <h1>📝 Therapist Notes</h1>
      <TherapistNotes />
      <button onClick={() => navigate("/dashboard")} className="btn">
        ⬅ Back to Dashboard
      </button>
    </div>
  );
}
