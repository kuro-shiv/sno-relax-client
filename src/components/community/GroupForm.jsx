import React, { useState } from "react";
import { API_ENDPOINTS } from "../../config/api.config";

export default function GroupForm({ userId, onGroupCreated, onCancel }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [maxMembers, setMaxMembers] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Group name is required");
      return;
    }

    if (name.length < 3 || name.length > 50) {
      setError("Group name must be 3-50 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(API_ENDPOINTS.COMMUNITY.CREATE_GROUP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || "",
          createdBy: userId,
          maxMembers: parseInt(maxMembers) || 50,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create group");
      }

      const newGroup = await res.json();
      setName("");
      setDescription("");
      setMaxMembers(50);

      if (onGroupCreated) onGroupCreated(newGroup);
    } catch (err) {
      console.error("Error creating group:", err);
      setError(err.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#f9f9f9",
        padding: 16,
        borderRadius: 8,
        border: "1px solid #ddd",
        marginBottom: 16,
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: 16 }}>Create New Group</h3>

      {error && (
        <div
          style={{
            padding: 10,
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

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 600 }}>
            Group Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter group name (3-50 characters)"
            style={{
              width: "100%",
              padding: "8px 10px",
              border: "1px solid #ddd",
              borderRadius: 4,
              fontSize: 13,
              boxSizing: "border-box",
            }}
            disabled={loading}
          />
          <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>
            {name.length}/50
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 600 }}>
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this group is about"
            style={{
              width: "100%",
              padding: "8px 10px",
              border: "1px solid #ddd",
              borderRadius: 4,
              fontSize: 13,
              boxSizing: "border-box",
              minHeight: 60,
              resize: "vertical",
            }}
            disabled={loading}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 600 }}>
            Max Members
          </label>
          <input
            type="number"
            value={maxMembers}
            onChange={(e) => setMaxMembers(e.target.value)}
            min="2"
            max="100"
            style={{
              width: "100%",
              padding: "8px 10px",
              border: "1px solid #ddd",
              borderRadius: 4,
              fontSize: 13,
              boxSizing: "border-box",
            }}
            disabled={loading}
          />
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: "8px 16px",
              background: "#f0f0f0",
              color: "#333",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "8px 16px",
              background: loading ? "#ccc" : "#4a90e2",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {loading ? "Creating..." : "Create Group"}
          </button>
        </div>
      </form>
    </div>
  );
}
