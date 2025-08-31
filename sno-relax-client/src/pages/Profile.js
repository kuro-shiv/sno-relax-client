// src/pages/Profile.js
import React, { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load from localStorage
    const storedUserId = localStorage.getItem("sno_userId");
    const storedFirst = localStorage.getItem("sno_firstName");
    const storedLast = localStorage.getItem("sno_lastName");
    const storedEmail = localStorage.getItem("sno_email");
    const storedPhone = localStorage.getItem("sno_phone");

    if (storedUserId) {
      setUser({
        id: storedUserId,
        firstName: storedFirst,
        lastName: storedLast,
        email: storedEmail,
        phone: storedPhone,
      });
    }
  }, []);

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-400">
        <h2 className="text-xl font-bold">No profile found ❌</h2>
        <p>Please login first.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-gray-900 text-white rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4">👤 User Profile</h1>

      <div className="flex items-center gap-4 mb-6">
        <img
          src="https://i.pravatar.cc/100"
          alt="Profile"
          className="w-20 h-20 rounded-full border-2 border-teal-400"
        />
        <div>
          <h2 className="text-lg font-semibold">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-sm text-gray-300">{user.email}</p>
          <p className="text-sm text-gray-300">{user.phone}</p>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="font-bold">User ID</h3>
        <p className="text-teal-400 break-words">{user.id}</p>
      </div>
    </div>
  );
}
