import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config/api.config";

export default function Profile() {
  const userId = localStorage.getItem("userId") || "guest";
  const userName = localStorage.getItem("userName") || "User";

  const [nickname, setNickname] = useState("Anonymous");
  const [editingNickname, setEditingNickname] = useState(false);
  const [newNickname, setNewNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch current nickname
  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.COMMUNITY.GET_NICKNAME(userId), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setNickname(data.nickname || "Anonymous");
          setNewNickname(data.nickname || "Anonymous");
        }
      } catch (err) {
        console.error("Error fetching nickname:", err);
      }
    };

    if (userId !== "guest") {
      fetchNickname();
    }
  }, [userId]);

  const validateNickname = (nick) => {
    if (!nick.trim()) {
      setError("Nickname cannot be empty");
      return false;
    }
    if (nick.length < 3) {
      setError("Nickname must be at least 3 characters");
      return false;
    }
    if (nick.length > 20) {
      setError("Nickname must be at most 20 characters");
      return false;
    }
    if (!/^[a-zA-Z0-9\s\u{1F300}-\u{1F9FF}]+$/u.test(nick)) {
      setError("Nickname can only contain letters, numbers, spaces, and emojis");
      return false;
    }
    return true;
  };

  const handleSaveNickname = async () => {
    setError(null);
    setSuccess(null);

    if (!validateNickname(newNickname)) {
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(API_ENDPOINTS.COMMUNITY.UPDATE_NICKNAME(userId), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ nickname: newNickname.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update nickname");
      }

      const data = await res.json();
      setNickname(data.nickname);
      setEditingNickname(false);
      setSuccess("Nickname updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating nickname:", err);
      setError(err.message || "Failed to update nickname");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingNickname(false);
    setNewNickname(nickname);
    setError(null);
  };

  const handleRemoveNickname = async () => {
    if (!confirm("Reset nickname to 'Anonymous'?")) return;

    try {
      setLoading(true);

      const res = await fetch(API_ENDPOINTS.COMMUNITY.UPDATE_NICKNAME(userId), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ nickname: "Anonymous" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to reset nickname");
      }

      const data = await res.json();
      setNickname(data.nickname);
      setNewNickname(data.nickname);
      setSuccess("Nickname reset to Anonymous");

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error resetting nickname:", err);
      setError(err.message || "Failed to reset nickname");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: 24,
        background: "#f9f9f9",
        borderRadius: 12,
      }}
    >
      <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: "bold" }}>Profile Settings</h2>

      {/* User Info */}
      <div
        style={{
          background: "white",
          padding: 16,
          borderRadius: 8,
          marginBottom: 24,
          border: "1px solid #ddd",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: 16 }}>Account Information</h3>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 4 }}>
            User ID
          </label>
          <div
            style={{
              padding: 10,
              background: "#f5f5f5",
              borderRadius: 4,
              fontFamily: "monospace",
              fontSize: 13,
            }}
          >
            {userId}
          </div>
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 4 }}>
            Name
          </label>
          <div
            style={{
              padding: 10,
              background: "#f5f5f5",
              borderRadius: 4,
              fontSize: 13,
            }}
          >
            {userName}
          </div>
        </div>
      </div>

      {/* Nickname Settings */}
      <div
        style={{
          background: "white",
          padding: 16,
          borderRadius: 8,
          border: "1px solid #ddd",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: 16 }}>
          Community Nickname (Anonymous)
        </h3>
        <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
          Your nickname is how you appear in community groups. It helps maintain your privacy while
          allowing meaningful conversations.
        </p>

        {error && (
          <div
            style={{
              padding: 12,
              background: "#ffebee",
              color: "#c62828",
              borderRadius: 4,
              marginBottom: 12,
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              padding: 12,
              background: "#e8f5e9",
              color: "#2e7d32",
              borderRadius: 4,
              marginBottom: 12,
              fontSize: 13,
            }}
          >
            ✓ {success}
          </div>
        )}

        {!editingNickname ? (
          <div>
            <div
              style={{
                padding: 12,
                background: "#e8f4f8",
                borderRadius: 4,
                marginBottom: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Current Nickname</div>
                <div style={{ fontSize: 18, fontWeight: "bold", color: "#4a90e2" }}>
                  {nickname}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => {
                  setEditingNickname(true);
                  setNewNickname(nickname);
                }}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  background: "#4a90e2",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: "600",
                }}
              >
                Edit Nickname
              </button>
              <button
                onClick={handleRemoveNickname}
                disabled={loading || nickname === "Anonymous"}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  background: nickname === "Anonymous" ? "#ccc" : "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: nickname === "Anonymous" ? "not-allowed" : "pointer",
                  fontSize: 13,
                  fontWeight: "600",
                }}
              >
                Reset to Anonymous
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 6 }}>
                New Nickname
              </label>
              <input
                type="text"
                value={newNickname}
                onChange={(e) => {
                  setNewNickname(e.target.value);
                  setError(null);
                }}
                placeholder="Enter your community nickname"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  fontSize: 13,
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
                maxLength="20"
                disabled={loading}
              />
              <div
                style={{
                  fontSize: 11,
                  color: "#999",
                  marginTop: 4,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>3-20 characters, letters/numbers/spaces/emojis</span>
                <span>
                  {newNickname.length}/20
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={handleCancel}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  background: "#f0f0f0",
                  color: "#333",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: "600",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNickname}
                disabled={loading || !newNickname.trim()}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  background: loading || !newNickname.trim() ? "#ccc" : "#4a90e2",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: loading || !newNickname.trim() ? "not-allowed" : "pointer",
                  fontSize: 13,
                  fontWeight: "600",
                }}
              >
                {loading ? "Saving..." : "Save Nickname"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
