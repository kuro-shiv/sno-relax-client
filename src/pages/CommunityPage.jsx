// src/pages/CommunityPage.jsx
import React, { useEffect, useState } from "react";
import TopicList from "../components/community/TopicList";
import TopicDetail from "../components/community/TopicDetail";
import SnoBotWidget from "../components/community/SnoBotWidget";
import ChallengeList from "../components/community/ChallengeList";
import MyProgress from "../components/community/MyProgress";
import ThemeToggle from "../components/ThemeToggle";

export default function CommunityPage() {
  const [theme, setTheme] = useState(localStorage.getItem("sno-theme") || "light");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Minimal auth shim: try to get user id from localStorage; fallback to generated id
    let uid = localStorage.getItem("sno_user_id");
    if (!uid) {
      uid = `u_${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem("sno_user_id", uid);
    }
    setUserId(uid);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("sno-theme", next);
  };

  return (
    <div className={`community-page ${theme}`} style={{ display: "flex", gap: 16 }}>
      <aside style={{ width: 300, padding: 16, borderRight: "1px solid #eee" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>Community Topics</h3>
          <ThemeToggle theme={theme} toggle={toggleTheme} />
        </div>
        <TopicList onSelect={setSelectedTopic} selected={selectedTopic} />
        <hr />
        <ChallengeList userId={userId} />
      </aside>

      <main style={{ flex: 1, padding: 16 }}>
        {selectedTopic ? (
          <TopicDetail topic={selectedTopic} userId={userId} />
        ) : (
          <div>
            <h2>Welcome to the SnoRelax Community</h2>
            <p>
              This space focuses on private reflections, guided prompts, and
              gentle challenges — not social feeds. Choose a topic on the left
              to begin a private reflection or try a short challenge.
            </p>
          </div>
        )}
      </main>

      <aside style={{ width: 320, padding: 16, borderLeft: "1px solid #eee" }}>
        <SnoBotWidget userId={userId} onSave={() => {}} />
        <hr />
        <MyProgress userId={userId} />
      </aside>
    </div>
  );
}
