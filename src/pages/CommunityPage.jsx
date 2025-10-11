// src/pages/CommunityPage.jsx
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import GroupChat from "../components/GroupChat";
import PersonalChat from "../components/PersonalChat";
import ThemeToggle from "../components/ThemeToggle";

export default function CommunityPage() {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [view, setView] = useState("group"); // group | personal

  // Theme state stored in localStorage
  const [theme, setTheme] = useState(
    localStorage.getItem("sno-theme") || "light"
  );

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("sno-theme", newTheme);
  };

  return (
    <div className={`community-page ${theme}`}>
      <Sidebar
        onSelectGroup={(group) => {
          setSelectedGroup(group);
          setView("group");
        }}
        onSelectUser={(user) => {
          setSelectedUser(user);
          setView("personal");
        }}
      />

      <main className="chat-area">
        <div className="chat-header">
          <h2>
            {view === "group"
              ? selectedGroup?.name || "Select a Group"
              : selectedUser?.name || "Select a Friend"}
          </h2>
          <ThemeToggle theme={theme} toggle={handleThemeToggle} />
        </div>

        <div className="chat-content">
          {view === "group" && selectedGroup && (
            <GroupChat group={selectedGroup} />
          )}
          {view === "personal" && selectedUser && (
            <PersonalChat user={selectedUser} />
          )}
          {!selectedGroup && view === "group" && (
            <p className="placeholder">Select a group to start chatting</p>
          )}
          {!selectedUser && view === "personal" && (
            <p className="placeholder">Select a friend to start chatting</p>
          )}
        </div>
      </main>
    </div>
  );
}
