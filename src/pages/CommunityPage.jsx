// src/pages/CommunityPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { API_ENDPOINTS } from "../config/api.config";
import "../styles/Community.css";

export default function CommunityPage() {
  const userId = localStorage.getItem("userId") || localStorage.getItem("sno_user_id") || `u_${Math.random().toString(36).slice(2, 9)}`;
  const userRole = localStorage.getItem("userRole") || "user";
  
  // States
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [msgInput, setMsgInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [nickname, setNickname] = useState(localStorage.getItem("communityNickname") || "Anonymous");
  const [showViolationPopup, setShowViolationPopup] = useState(!localStorage.getItem("communityPolicyAccepted"));
  const messagesEndRef = useRef(null);

  // Load groups on mount
  useEffect(() => {
    loadGroups();
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages when group is selected
  useEffect(() => {
    if (selectedGroup) {
      loadMessages();
      loadGroupMembers();
    }
  }, [selectedGroup]);

  const loadGroups = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.COMMUNITY.GET_GROUPS, {
        credentials: "include"
      });
      const data = await res.json();
      setGroups(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading groups:", err);
      setGroups([]);
    }
  };

  const loadMessages = async () => {
    if (!selectedGroup) return;
    try {
      const res = await fetch(API_ENDPOINTS.COMMUNITY.GET_GROUP_MESSAGES(selectedGroup._id), {
        credentials: "include"
      });
      const data = await res.json();
      setMessages(data.messages || data || []);
    } catch (err) {
      console.error("Error loading messages:", err);
      setMessages([]);
    }
  };

  const loadGroupMembers = async () => {
    if (!selectedGroup) return;
    try {
      const res = await fetch(API_ENDPOINTS.COMMUNITY.GET_GROUP_MEMBERS(selectedGroup._id), {
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setGroupMembers(Array.isArray(data) ? data : []);
      } else {
        setGroupMembers([]);
      }
    } catch (err) {
      console.error("Error loading group members:", err);
      setGroupMembers([]);
    }
  };

  const createGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    try {
      setLoading(true);
      const res = await fetch(API_ENDPOINTS.COMMUNITY.CREATE_GROUP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: groupName,
          description: groupDesc,
          createdBy: userId
        })
      });
      const newGroup = await res.json();
      setGroups(p => [...p, newGroup]);
      setGroupName("");
      setGroupDesc("");
      setShowCreateModal(false);
      setSelectedGroup(newGroup);
    } catch (err) {
      console.error("Error creating group:", err);
      alert("Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (groupId) => {
    try {
      const res = await fetch(API_ENDPOINTS.COMMUNITY.JOIN_GROUP(groupId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, nickname })
      });
      if (res.ok) {
        const data = await res.json();
        // refresh groups and members for the selected group
        await loadGroups();
        await loadGroupMembers();
        // if the group wasn't selected before, set it
        if (!selectedGroup || selectedGroup._id !== groupId) {
          const g = groups.find(g => g._id === groupId);
          if (g) setSelectedGroup(g);
        }
      } else {
        const txt = await res.text();
        console.error('Join group failed:', res.status, txt);
        alert("Failed to join group");
      }
    } catch (err) {
      console.error("Error joining group:", err);
      alert("Error joining group");
    }
  };

  const leaveGroup = async (groupId) => {
    try {
      const res = await fetch(API_ENDPOINTS.COMMUNITY.LEAVE_GROUP(groupId), {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        setSelectedGroup(null);
        loadGroups();
      }
    } catch (err) {
      console.error("Error leaving group:", err);
    }
  };

  const deleteGroup = async (groupId) => {
    if (!window.confirm("Delete this group?")) return;
    try {
      const res = await fetch(API_ENDPOINTS.COMMUNITY.DELETE_GROUP(groupId), {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        setSelectedGroup(null);
        loadGroups();
      }
    } catch (err) {
      console.error("Error deleting group:", err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!msgInput.trim() || !selectedGroup) return;

    try {
      setLoading(true);
      const res = await fetch(API_ENDPOINTS.COMMUNITY.POST_GROUP_MESSAGE(selectedGroup._id), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ senderId: userId, senderNickname: nickname, message: msgInput })
      });
      if (res.ok) {
        setMsgInput("");
        loadMessages();
      } else if (res.status === 403) {
        // Not a member — prompt to join
        const shouldJoin = window.confirm('You are not a member of this group. Join now to send messages?');
        if (shouldJoin) {
          await joinGroup(selectedGroup._id);
          // after joining, attempt to send again
          try {
            const retry = await fetch(API_ENDPOINTS.COMMUNITY.POST_GROUP_MESSAGE(selectedGroup._id), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ senderId: userId, senderNickname: nickname, message: msgInput })
            });
            if (retry.ok) {
              setMsgInput("");
              loadMessages();
            } else {
              alert('Failed to send message after joining.');
            }
          } catch (err) {
            console.error('Retry send error:', err);
            alert('Failed to send message after joining.');
          }
        }
      } else {
        const txt = await res.text();
        console.warn('Send message failed:', res.status, txt);
        alert('Failed to send message');
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (msgId) => {
    try {
      const res = await fetch(API_ENDPOINTS.COMMUNITY.DELETE_MESSAGE(msgId), {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        loadMessages();
      }
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  return (
    <div className="community-page">
      {/* Violation Popup */}
      {showViolationPopup && (
        <div className="violation-modal">
          <div className="violation-content">
            <h2>📜 Community Rules</h2>
            <ul style={{ textAlign: "left", lineHeight: 1.6, marginBottom: 12 }}>
              <li>• Be respectful — do not insult or harass members.</li>
              <li>• No hate speech, threats, or abusive language.</li>
              <li>• No spamming or self-promotion without permission.</li>
              <li>• Do not share private or identifying information about others.</li>
              <li>• Follow moderators' instructions and report issues.</li>
            </ul>
            <div style={{ marginTop: 12, textAlign: "center" }}>
              <button onClick={() => {
                setShowViolationPopup(false);
                localStorage.setItem("communityPolicyAccepted", "true");
              }}>OK</button>
            </div>
          </div>
        </div>
      )}

      <div className="community-sidebar">
        <div className="sidebar-header">
          <h2>Groups</h2>
          {userRole === "admin" && (
            <button className="create-btn" onClick={() => setShowCreateModal(true)}>
              ➕
            </button>
          )}
        </div>

        <div className="groups-list">
          {groups.map(group => (
            <div
              key={group._id}
              className={`group-item ${selectedGroup?._id === group._id ? "active" : ""}`}
              onClick={() => setSelectedGroup(group)}
            >
              <div className="group-info">
                <h4>{group.name}</h4>
                <p>{group.memberCount || 0} members</p>
              </div>
              {(userRole === "admin" || group.adminId === userId) && (
                <button className="group-menu" onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("Delete this group?")) {
                    deleteGroup(group._id);
                  }
                }}>
                  ⋮
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="community-main">
        {selectedGroup ? (
          <>
            <div className="chat-header-comm">
              <div className="header-info">
                <h3>{selectedGroup.name}</h3>
                <p>{selectedGroup.description || "No description"}</p>
              </div>
              <div className="header-actions">
                  {groupMembers.some(m => m.userId === userId) ? (
                    <button
                      className="leave-btn"
                      onClick={() => {
                        if (window.confirm("Leave this group?")) {
                          leaveGroup(selectedGroup._id);
                        }
                      }}
                    >
                      Leave
                    </button>
                  ) : (
                    <button
                      className="join-btn"
                      onClick={() => joinGroup(selectedGroup._id)}
                    >
                      Join
                    </button>
                  )}
              </div>
            </div>

            <div className="messages-container">
              {messages.length === 0 ? (
                <div style={{ textAlign: "center", color: "#999", marginTop: "20px" }}>
                  No messages yet. Start a conversation!
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg._id} className={`message-item ${msg.senderId === userId ? "own" : ""}`}>
                    <div className="msg-bubble">
                      <div className="msg-sender">{msg.senderNickname || "Anonymous"}</div>
                      <div className="msg-text">{msg.message}</div>
                      {msg.isEdited && <span className="edited">(edited)</span>}
                    </div>
                    {msg.senderId === userId && (
                      <button
                        className="msg-delete"
                        onClick={() => {
                          if (window.confirm("Delete message?")) {
                            deleteMessage(msg._id);
                          }
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="msg-input-area">
              <div className="nickname-display">
                <span>As: <strong>{nickname}</strong></span>
              </div>
              <form onSubmit={sendMessage}>
                <input
                  type="text"
                  value={msgInput}
                  onChange={(e) => setMsgInput(e.target.value)}
                  placeholder="Type message..."
                  className="msg-input"
                  disabled={loading}
                />
                <button type="submit" disabled={loading || !msgInput.trim()} className="msg-send">
                  ➤
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="no-selection">
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "24px", marginBottom: "16px" }}>👈 Select a group to start chatting</p>
              <p style={{ fontSize: "14px", color: "#bbb" }}>Join or create a group to connect with the community</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Group</h3>
            <form onSubmit={createGroup}>
              <input
                type="text"
                placeholder="Group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
              <textarea
                placeholder="Group description (optional)"
                value={groupDesc}
                onChange={(e) => setGroupDesc(e.target.value)}
                rows="3"
              />
              <div className="modal-buttons">
                <button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create"}
                </button>
                <button type="button" onClick={() => setShowCreateModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
