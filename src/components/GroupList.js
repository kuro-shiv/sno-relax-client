import React, { useEffect, useState } from "react";
import { fetchGroups, joinGroup, leaveGroup } from "../api/community";

export default function GroupList({ userId, onSelectGroup }) {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    loadGroups();
  }, []);

  async function loadGroups() {
    const res = await fetchGroups();
    if (res.ok) setGroups(res.groups);
  }

  async function handleJoin(groupId) {
    await joinGroup(groupId, userId);
    loadGroups();
  }

  async function handleLeave(groupId) {
    await leaveGroup(groupId, userId);
    loadGroups();
  }

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-3 text-white">Community Groups</h2>
      {groups.map((g) => (
        <div key={g.id} className="p-2 mb-2 bg-gray-800 rounded">
          <h3 className="text-lg text-blue-400 cursor-pointer" onClick={() => onSelectGroup(g)}>
            {g.name}
          </h3>
          <p className="text-gray-400">{g.description}</p>
          {g.members.includes(userId) ? (
            <button
              onClick={() => handleLeave(g.id)}
              className="text-sm text-red-400 mt-1"
            >
              Leave
            </button>
          ) : (
            <button
              onClick={() => handleJoin(g.id)}
              className="text-sm text-green-400 mt-1"
            >
              Join
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
