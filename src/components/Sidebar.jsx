// src/components/Sidebar.jsx
import React, { useEffect, useState } from "react";
import GroupList from "./GroupList";
import UserList from "./UserList";

export default function Sidebar({ onSelectGroup, onSelectUser }) {
  return (
    <aside className="sidebar">
      <h3>Groups</h3>
      <GroupList onSelectGroup={onSelectGroup} />

      <h3>Friends</h3>
      <UserList onSelectUser={onSelectUser} />
    </aside>
  );
}
