// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Edit,
  ArrowLeft,
  Mail,
  Phone,
  Hash,
  Calendar,
  FileText,
  UserCircle,
} from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState({
    id: "SR1234",
    firstName: "Anonymous",
    lastName: "User",
    email: "not-found@gmail.com",
    phone: "N/A",
    dob: "1998-07-12",
    avatar: "https://i.imgur.com/KR0NKdM.png", // default anime avatar
    history: "Emergency Contact: None. Medical Info: None.",
    mood: { happy: 70, calm: 80, stress: 40 },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(user.avatar);
  const navigate = useNavigate();

  // Load user from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("sno_user"));
    if (stored) {
      setUser(stored);
      setPreviewAvatar(stored.avatar);
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle avatar upload
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

  // Save to localStorage
  const handleSave = () => {
    localStorage.setItem("sno_user", JSON.stringify(user));
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1e3d] to-[#12264d] flex flex-col items-center px-4 py-6 text-white">
      {/* Top Bar */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm px-3 py-1 bg-blue-900/40 rounded-lg hover:bg-blue-900/60 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
        >
          <Edit className="w-4 h-4" /> {isEditing ? "Save" : "Edit"}
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-[#12264d] rounded-2xl shadow-lg p-6 w-full max-w-4xl flex flex-col md:flex-row gap-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-2">
          {previewAvatar ? (
            <img
              src={previewAvatar}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-blue-400 shadow-md object-cover"
            />
          ) : (
            <div className="w-32 h-32 flex items-center justify-center rounded-full border-4 border-gray-600 bg-gray-700 text-gray-400 shadow-md">
              <UserCircle className="w-16 h-16" />
            </div>
          )}

          {isEditing && (
            <label className="cursor-pointer text-sm bg-blue-900/60 hover:bg-blue-900/80 px-3 py-1 rounded-lg mt-2">
              Upload Avatar
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 space-y-3">
          {isEditing ? (
            <>
              <div>
                <label className="text-sm font-semibold">First Name</label>
                <input
                  name="firstName"
                  value={user.firstName}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1 bg-blue-900/40 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Last Name</label>
                <input
                  name="lastName"
                  value={user.lastName}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1 bg-blue-900/40 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Email</label>
                <input
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1 bg-blue-900/40 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Phone</label>
                <input
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1 bg-blue-900/40 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={user.dob}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1 bg-blue-900/40 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">
                  Emergency / Medical Info
                </label>
                <textarea
                  name="history"
                  value={user.history}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border rounded px-3 py-2 mt-1 bg-blue-900/40 text-white"
                />
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold">
                {user.firstName} {user.lastName}
              </h2>
              <p className="flex items-center gap-2 text-blue-200">
                <Mail className="w-4 h-4" /> {user.email}
              </p>
              <p className="flex items-center gap-2 text-blue-200">
                <Phone className="w-4 h-4" /> {user.phone}
              </p>
              <p className="flex items-center gap-2 text-blue-200">
                <Hash className="w-4 h-4" /> {user.id}
              </p>
              <p className="flex items-center gap-2 text-blue-200">
                <Calendar className="w-4 h-4" /> {user.dob}
              </p>
              <p className="flex items-center gap-2 text-blue-200">
                <FileText className="w-4 h-4" /> {user.history}
              </p>
            </>
          )}

          {/* Mood Tracker */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Mood Tracker</h3>
            {Object.keys(user.mood).map((m) => (
              <div key={m} className="mb-2">
                <span className="text-sm capitalize">{m}</span>
                <div className="w-full bg-blue-900 rounded-full h-3 mt-1">
                  <div
                    className="bg-blue-400 h-3 rounded-full"
                    style={{ width: `${user.mood[m]}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-2 mt-6">
            <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg">
              AI Chatbot
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg">
              Guided Exercises
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg">
              View Reports
            </button>
            <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
