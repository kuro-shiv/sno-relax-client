import React, { useState, useEffect } from "react";
import GroupList from "../components/GroupList";
import GroupChat from "../components/GroupChat";
import { fetchGroups, joinGroup, leaveGroup, fetchMessages, sendMessage } from "../api/community";

export default function CommunityPage() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem("sno_userId") || "Guest123");

  useEffect(() => {
    loadGroups();
  }, []);

  async function loadGroups() {
    const res = await fetchGroups();
    if (res.ok) setGroups(res.groups);
  }

  async function handleJoin(groupId) {
    await joinGroup(groupId, userId);
    loadGroups();
  }

  async function handleLeave(groupId) {
    await leaveGroup(groupId, userId);
    loadGroups();
    if (selectedGroup?.id === groupId) setSelectedGroup(null);
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Group List */}
      <div style={{ width: "250px", background: "#1a1a1a", padding: "16px", overflowY: "auto" }}>
        <GroupList
          groups={groups}
          userId={userId}
          onSelectGroup={setSelectedGroup}
          onJoin={handleJoin}
          onLeave={handleLeave}
        />
      </div>

      {/* Group Chat */}
      <div style={{ flex: 1, padding: "16px" }}>
        <GroupChat group={selectedGroup} userId={userId} />
      </div>
    </div>
  );
}
