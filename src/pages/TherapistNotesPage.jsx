import React from "react";
import TherapistNotes from "../components/TherapistNotes";
import { useNavigate } from "react-router-dom";
import styles from "../styles/therapistNotes.css";
// ✅ single CSS module

export default function TherapistNotesPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <h1>📝 Therapist Notes</h1>
      <div className={styles.notesWrapper}>
        <TherapistNotes />
      </div>
    </div>
  );
}
