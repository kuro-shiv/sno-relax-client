import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";
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
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Load user from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("sno_userId");
    if (!storedUserId) return;

    setUser({
      id: storedUserId,
      firstName: localStorage.getItem("sno_firstName") || "Guest",
      lastName: localStorage.getItem("sno_lastName") || "",
      email: localStorage.getItem("sno_email") || "not-found@gmail.com",
      phone: localStorage.getItem("sno_phone") || "N/A",
      avatar: localStorage.getItem("sno_avatar") || null,
      dob: localStorage.getItem("sno_dob") || "1998-07-12",
      history: localStorage.getItem("sno_history") || "No major illnesses reported.",
    });
  }, []);

  if (!user) {
    return (
      <div className="profile-page min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h2 className="text-2xl font-bold mb-2">No profile found ❌</h2>
        <p className="text-gray-500">Please login first.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    Object.keys(user).forEach((key) => localStorage.setItem(`sno_${key}`, user[key]));
    setIsEditing(false);
  };

  return (
    <div className="profile-page min-h-screen bg-gray-100 flex flex-col items-center px-4 py-6">
      {/* Top Bar */}
      <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2 sm:gap-0">
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
            className="w-32 h-32 rounded-full border-4 border-gray-200 shadow-md object-cover mx-auto md:mx-0"
          />
        ) : (
          <div className="w-32 h-32 flex items-center justify-center rounded-full border-4 border-gray-200 bg-gray-200 text-gray-500 shadow-md mx-auto md:mx-0">
            <UserCircle className="w-16 h-16" />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 text-gray-800 space-y-3">
          {isEditing ? (
            <>
              {["firstName", "lastName", "email", "phone", "dob", "history"].map((field) => (
                <div key={field}>
                  <label className="text-sm font-semibold capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                  {field === "history" ? (
                    <textarea
                      name={field}
                      value={user[field]}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2 mt-1"
                      rows={3}
                    />
                  ) : (
                    <input
                      type={field === "dob" ? "date" : "text"}
                      name={field}
                      value={user[field]}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2 mt-1"
                    />
                  )}
                </div>
              ))}
              <div>
                <label className="text-sm font-semibold">User ID</label>
                <input
                  name="id"
                  value={user.id}
                  disabled
                  className="w-full border rounded px-3 py-2 mt-1 bg-gray-100"
                />
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-center md:text-left">
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
