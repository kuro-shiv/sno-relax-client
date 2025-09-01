// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, ArrowLeft, Mail, Phone, Hash, Calendar, FileText, UserCircle } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Load user from localStorage (simulating Gmail login)
  useEffect(() => {
    const storedUserId = localStorage.getItem("sno_userId");
    const storedFirst = localStorage.getItem("sno_firstName");
    const storedLast = localStorage.getItem("sno_lastName");
    const storedEmail = localStorage.getItem("sno_email");
    const storedPhone = localStorage.getItem("sno_phone");
    const storedAvatar = localStorage.getItem("sno_avatar");

    if (storedUserId) {
      setUser({
        id: storedUserId,
        firstName: storedFirst || "Guest",
        lastName: storedLast || "",
        email: storedEmail || "not-found@gmail.com",
        phone: storedPhone || "N/A",
        avatar: storedAvatar || null,
        dob: localStorage.getItem("sno_dob") || "1998-07-12",
        history: localStorage.getItem("sno_history") || "No major illnesses reported.",
      });
    }
  }, []);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h2 className="text-2xl font-bold mb-2">No profile found ❌</h2>
        <p className="text-gray-500">Please login first.</p>
      </div>
    );
  }

  // Update form
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Save updated user back to localStorage
  const handleSave = () => {
    localStorage.setItem("sno_firstName", user.firstName);
    localStorage.setItem("sno_lastName", user.lastName);
    localStorage.setItem("sno_email", user.email);
    localStorage.setItem("sno_phone", user.phone);
    localStorage.setItem("sno_dob", user.dob);
    localStorage.setItem("sno_history", user.history);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-6">
      {/* Top Bar */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
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
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-4xl flex flex-col md:flex-row gap-6">
        {/* Avatar */}
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-gray-200 shadow-md object-cover"
          />
        ) : (
          <div className="w-32 h-32 flex items-center justify-center rounded-full border-4 border-gray-200 bg-gray-200 text-gray-500 shadow-md">
            <UserCircle className="w-16 h-16" />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 text-gray-800 space-y-3">
          {isEditing ? (
            <>
              <div>
                <label className="text-sm font-semibold">First Name</label>
                <input
                  name="firstName"
                  value={user.firstName}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Last Name</label>
                <input
                  name="lastName"
                  value={user.lastName}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Email</label>
                <input
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Phone</label>
                <input
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">User ID</label>
                <input
                  name="id"
                  value={user.id}
                  disabled
                  className="w-full border rounded px-3 py-2 mt-1 bg-gray-100"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={user.dob}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Past Medical History</label>
                <textarea
                  name="history"
                  value={user.history}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  rows={3}
                />
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold">
                {user.firstName} {user.lastName}
              </h2>
              <p className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" /> {user.email}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" /> {user.phone}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <Hash className="w-4 h-4" /> {user.id}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" /> {user.dob}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <FileText className="w-4 h-4" /> {user.history}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
