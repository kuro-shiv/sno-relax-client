import React, { useState } from "react";

export default function CommunityPolicyPopup({ onConfirm }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleConfirm = () => {
    setIsOpen(false);
    if (onConfirm) onConfirm();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 12,
          padding: 24,
          maxWidth: 500,
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 16, fontSize: 20, color: "#333" }}>
          ⚠️ Community Guidelines & Safety Policy
        </h2>

        <div style={{ fontSize: 13, color: "#666", lineHeight: 1.8, marginBottom: 20 }}>
          <p>Welcome to our community groups! To maintain a safe and respectful space for everyone, please follow these guidelines:</p>

          <h3 style={{ marginTop: 16, marginBottom: 8, color: "#4a90e2", fontSize: 14 }}>
            ✓ DO:
          </h3>
          <ul style={{ marginTop: 8, marginBottom: 12, paddingLeft: 20 }}>
            <li style={{ marginBottom: 6 }}>Be respectful and kind to other members</li>
            <li style={{ marginBottom: 6 }}>Support and encourage fellow community members</li>
            <li style={{ marginBottom: 6 }}>Share positive experiences and constructive feedback</li>
            <li style={{ marginBottom: 6 }}>Respect everyone's privacy and anonymity</li>
            <li style={{ marginBottom: 6 }}>Report any violations to our moderation team</li>
          </ul>

          <h3 style={{ marginTop: 16, marginBottom: 8, color: "#f44336", fontSize: 14 }}>
            ✗ DON'T:
          </h3>
          <ul style={{ marginTop: 8, marginBottom: 16, paddingLeft: 20 }}>
            <li style={{ marginBottom: 6 }}>
              <strong>Use abusive, offensive, or vulgar language</strong>
            </li>
            <li style={{ marginBottom: 6 }}>
              <strong>Harass, bully, or discriminate</strong> against any member
            </li>
            <li style={{ marginBottom: 6 }}>
              <strong>Share false information</strong> or misinformation
            </li>
            <li style={{ marginBottom: 6 }}>
              <strong>Post spam, promotional content</strong>, or advertisements
            </li>
            <li style={{ marginBottom: 6 }}>
              <strong>Share personal information</strong> (phone, email, address) of others
            </li>
            <li style={{ marginBottom: 6 }}>
              <strong>Send inappropriate or sexual content</strong>
            </li>
            <li style={{ marginBottom: 6 }}>
              <strong>Impersonate</strong> others or pretend to be someone you're not
            </li>
          </ul>

          <h3 style={{ marginTop: 16, marginBottom: 8, color: "#ff9800", fontSize: 14 }}>
            ⚡ Consequences:
          </h3>
          <p style={{ margin: "8px 0" }}>
            Violations may result in:
          </p>
          <ul style={{ marginTop: 8, marginBottom: 12, paddingLeft: 20 }}>
            <li style={{ marginBottom: 6 }}>Message deletion</li>
            <li style={{ marginBottom: 6 }}>Temporary or permanent ban from groups</li>
            <li style={{ marginBottom: 6 }}>Account suspension</li>
          </ul>

          <div
            style={{
              marginTop: 16,
              padding: 12,
              background: "#e8f5e9",
              borderRadius: 8,
              borderLeft: "4px solid #4caf50",
            }}
          >
            <p style={{ margin: 0, fontSize: 12 }}>
              <strong>Remember:</strong> Everyone deserves a safe, supportive space. Help us maintain a
              positive community by being considerate and respectful. 💚
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={handleConfirm}
            style={{
              flex: 1,
              padding: "12px 16px",
              background: "#4a90e2",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            I Understand & Agree
          </button>
        </div>

        <p style={{ marginTop: 12, fontSize: 11, color: "#999", textAlign: "center", margin: "12px 0 0 0" }}>
          By clicking "I Understand & Agree", you commit to following these guidelines.
        </p>
      </div>
    </div>
  );
}
