import React, { useEffect, useState } from "react";
import "../styles/Profile.css";

export default function Profile() {
  const [user, setUser] = useState({
    id: "SR1234",
    name: "John Doe",
    email: "not-found@gmail.com",
    phone: "N/A",
    dob: "1998-07-12",
    avatar: "https://i.imgur.com/KR0NKdM.png",
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

  const handleAction = (action) => {
    alert(`You clicked: ${action}`);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Avatar & Info */}
        <div className="profile-header">
          <img
            src={previewAvatar}
            alt="Profile Avatar"
            className="profile-pic"
          />
          {isEditing && (
            <label className="upload-btn">
              Upload Avatar
              <input type="file" accept="image/*" onChange={handleAvatarChange} />
            </label>
          )}
          <h2 className="username">{user.name}</h2>
          <p className="user-role">Anonymous ID: {user.id}</p>
        </div>

        {/* Mood Tracker */}
        <div className="profile-mood">
          <h3>Mood Summary</h3>
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
          {["AI Chatbot", "Guided Exercises", "View Reports", "Logout"].map(
            (action) => (
              <button key={action} onClick={() => handleAction(action)}>
                {action}
              </button>
            )
          )}
        </div>

        {/* Edit Profile */}
        {isEditing && (
          <div className="edit-section">
            <label>Name:</label>
            <input name="name" value={user.name} onChange={handleChange} />
            <label>Email:</label>
            <input name="email" value={user.email} onChange={handleChange} />
            <label>Phone:</label>
            <input name="phone" value={user.phone} onChange={handleChange} />
            <label>Date of Birth:</label>
            <input type="date" name="dob" value={user.dob} onChange={handleChange} />
            <label>Emergency / Medical Info:</label>
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
