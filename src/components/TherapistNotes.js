import React, { useState, useEffect } from "react";
import "./therapistNotes.css";

export default function TherapistNotes() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("therapistNotes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem("therapistNotes", JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = () => {
    if (newNote.trim() === "") return;
    const note = {
      id: Date.now(),
      text: newNote,
      date: new Date().toLocaleString(),
    };
    setNotes([note, ...notes]);
    setNewNote("");
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <div className="therapist-notes">
      <div className="note-input">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write a note..."
          className="textarea"
        />
        <button onClick={handleAddNote} className="btn">
          ➕ Add Note
        </button>
      </div>

      <div className="notes-list">
        {notes.length === 0 ? (
          <p className="empty">No notes yet.</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="note-card">
              <p>{note.text}</p>
              <small>{note.date}</small>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="btn delete"
              >
                🗑 Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
