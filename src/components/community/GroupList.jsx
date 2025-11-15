import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../config/api.config";

export default function GroupList({ onSelect, selected, onJoin }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userGroups, setUserGroups] = useState(new Set());

  const userId = localStorage.getItem("userId") || "guest";

  useEffect(() => {
    const loadGroups = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_ENDPOINTS.COMMUNITY.GET_GROUPS, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch groups");

        const data = await res.json();
        const groupsArray = Array.isArray(data) ? data : data.groups || [];

        setGroups(groupsArray);

        // Track which groups user is already a member of
        const memberGroups = new Set(
          groupsArray
            .filter(g => g.members && g.members.some(m => m.userId === userId))
            .map(g => g._id)
        );
        setUserGroups(memberGroups);

        setError(null);
      } catch (err) {
        console.error("Error loading groups:", err);
        setError("Failed to load groups");
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, [userId]);

  const handleJoin = async (groupId, e) => {
    e.stopPropagation();

    try {
      const nickname = localStorage.getItem('communityNickname') || 'Anonymous';
      const res = await fetch(API_ENDPOINTS.COMMUNITY.JOIN_GROUP(groupId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, nickname }),
      });

      if (!res.ok) throw new Error("Failed to join group");

      const updatedGroup = await res.json();
      setGroups(groups.map(g => g._id === groupId ? updatedGroup.group || updatedGroup : g));
      setUserGroups(prev => new Set([...prev, groupId]));

      if (onJoin) onJoin(updatedGroup.group || updatedGroup);
    } catch (err) {
      console.error("Error joining group:", err);
      alert(`Failed to join group: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <p>Loading groups...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, color: "red", textAlign: "center" }}>
        <p>{error}</p>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "#999" }}>
        <p>No groups available</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {groups.map((g) => {
        const isMember = userGroups.has(g._id);
        return (
          <div
            key={g._id}
            onClick={() => onSelect(g)}
            style={{
              padding: 12,
              borderRadius: 8,
              cursor: "pointer",
              background: selected?._id === g._id ? "#e8f4f8" : "#f9f9f9",
              border: selected?._id === g._id ? "2px solid #4a90e2" : "1px solid #ddd",
              marginBottom: 4,
              transition: "all 0.2s ease",
            }}
            className="group-list-item"
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: 14 }}>{g.name}</strong>
                <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                  {g.description || "No description"}
                </div>
                <div style={{ fontSize: 11, color: "#999", marginTop: 6 }}>
                  👥 {g.memberCount || g.members?.length || 0} members
                </div>
              </div>

              {!isMember && (
                <button
                  onClick={(e) => handleJoin(g._id, e)}
                  style={{
                    padding: "6px 12px",
                    background: "#4a90e2",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 12,
                    marginLeft: 10,
                  }}
                >
                  Join
                </button>
              )}
              {isMember && (
                <span
                  style={{
                    padding: "6px 12px",
                    background: "#e8f4f8",
                    color: "#4a90e2",
                    borderRadius: 4,
                    fontSize: 12,
                    marginLeft: 10,
                    fontWeight: "bold",
                  }}
                >
                  ✓ Member
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
