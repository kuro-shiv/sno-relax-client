import React, { useState, useEffect } from "react";
import "../styles/Profile.css";

export default function Profile() {
  const [user, setUser] = useState({
    id: "SR1234",
    name: "Anonymous User",
    email: "not-found@gmail.com",
    phone: "N/A",
    dob: "1998-07-12",
    avatar: "https://i.imgur.com/KR0NKdM.png", // default anime avatar
    history: "Emergency Contact: None. Medical Info: None.",
    mood: { happy: 70, calm: 80, stress: 40 },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(user.avatar);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("sno_user"));
    if (storedUser) {
      setUser(storedUser);
      setPreviewAvatar(storedUser.avatar);
    }
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewAvatar(reader.result);
      setUser({ ...user, avatar: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem("sno_user", JSON.stringify(user));
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Avatar & Info */}
        <div className="profile-header">
          <img src={previewAvatar} alt="Avatar" className="profile-pic" />
          {isEditing && (
            <label className="upload-btn">
              Upload Avatar
              <input type="file" accept="image/*" onChange={handleAvatarChange} />
            </label>
          )}
          <h2 className="username">{user.name}</h2>
          <p className="user-id">ID: {user.id}</p>
        </div>

        {/* Mood Tracker */}
        <div className="profile-mood">
          <h3>Mood Tracker</h3>
          {Object.keys(user.mood).map((m) => (
            <div key={m} className="mood-bar">
              <span>{m.charAt(0).toUpperCase() + m.slice(1)}</span>
              <div className="bar">
                <div className="fill" style={{ width: `${user.mood[m]}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="profile-actions">
          <button>AI Chatbot</button>
          <button>Guided Exercises</button>
          <button>View Reports</button>
          <button className="logout">Logout</button>
        </div>

        {/* Edit Section */}
        {isEditing && (
          <div className="edit-section">
            <label>Name</label>
            <input name="name" value={user.name} onChange={handleChange} />

            <label>Email</label>
            <input name="email" value={user.email} onChange={handleChange} />

            <label>Phone</label>
            <input name="phone" value={user.phone} onChange={handleChange} />

            <label>Date of Birth</label>
            <input type="date" name="dob" value={user.dob} onChange={handleChange} />

            <label>Emergency / Medical Info</label>
            <textarea
              name="history"
              value={user.history}
              onChange={handleChange}
              rows="3"
            />

            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
          </div>
        )}

        {!isEditing && (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
