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
import "../styles/Profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Load user info from localStorage
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
      history:
        localStorage.getItem("sno_history") || "No major illnesses reported.",
    });
  }, []);

  if (!user) {
    return (
      <div className="profile-page flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h2 className="text-2xl font-bold mb-2">No profile found ❌</h2>
        <p className="text-gray-400">Please login first.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    Object.keys(user).forEach((key) =>
      localStorage.setItem(`sno_${key}`, user[key])
    );
    setIsEditing(false);
  };

  return (
    <div className="profile-page flex flex-col items-center min-h-screen bg-gray-900 text-white p-4">
      {/* Top Bar */}
      <div className="top-bar flex justify-between w-full max-w-4xl mb-6 flex-wrap gap-2">
        <button
          onClick={() => navigate(-1)}
          className="btn flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="btn flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition text-black"
        >
          <Edit className="w-4 h-4" /> {isEditing ? "Save" : "Edit"}
        </button>
      </div>

      {/* Profile Card */}
      <div className="profile-card bg-gray-800 rounded-2xl shadow-lg p-6 w-full max-w-4xl flex flex-col md:flex-row gap-6">
        {/* Avatar */}
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="Profile"
            className="avatar w-32 h-32 rounded-full border-4 border-gray-700 shadow-md mx-auto md:mx-0"
          />
        ) : (
          <div className="avatar w-32 h-32 flex items-center justify-center rounded-full border-4 border-gray-700 bg-gray-700 text-gray-400 shadow-md mx-auto md:mx-0">
            <UserCircle className="w-16 h-16" />
          </div>
        )}

        {/* User Info */}
        <div className="info flex-1 space-y-3 text-gray-200">
          {isEditing ? (
            <>
              {["firstName", "lastName", "email", "phone", "dob", "history"].map(
                (field) => (
                  <div key={field}>
                    <label className="text-sm font-semibold capitalize">
                      {field === "dob" ? "Date of Birth" : field}
                    </label>
                    {field === "history" ? (
                      <textarea
                        name={field}
                        value={user[field]}
                        onChange={handleChange}
                        className="input w-full border rounded px-3 py-2 mt-1 bg-gray-700 text-white border-gray-600"
                        rows={3}
                      />
                    ) : (
                      <input
                        type={field === "dob" ? "date" : "text"}
                        name={field}
                        value={user[field]}
                        onChange={handleChange}
                        className="input w-full border rounded px-3 py-2 mt-1 bg-gray-700 text-white border-gray-600"
                      />
                    )}
                  </div>
                )
              )}
              <div>
                <label className="text-sm font-semibold">User ID</label>
                <input
                  name="id"
                  value={user.id}
                  disabled
                  className="input w-full border rounded px-3 py-2 mt-1 bg-gray-600 text-gray-400 border-gray-500"
                />
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-center md:text-left">
                {user.firstName} {user.lastName}
              </h2>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> {user.email}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> {user.phone}
              </p>
              <p className="flex items-center gap-2">
                <Hash className="w-4 h-4" /> {user.id}
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> {user.dob}
              </p>
              <p className="flex items-center gap-2">
                <FileText className="w-4 h-4" /> {user.history}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
