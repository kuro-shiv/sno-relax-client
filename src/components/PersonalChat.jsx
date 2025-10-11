// src/components/UserList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api/admin";

export default function UserList({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const userId = localStorage.getItem("sno_userId") || "Guest123";

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await axios.get(`${API}/users`);
      setUsers(res.data.filter((u) => u._id !== userId)); // exclude self
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="user-list">
      {users.map((u) => (
        <div
          key={u._id}
          className="user-item"
          onClick={() => onSelectUser(u)}
        >
          {u.name || u.email}
        </div>
      ))}
    </div>
  );
}
