// src/components/MoodTracker.js
import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const MoodTracker = () => {
  const [data, setData] = useState([
    { day: "Mon", mood: 3 },
    { day: "Tue", mood: 4 },
    { day: "Wed", mood: 2 },
    { day: "Thu", mood: 5 },
    { day: "Fri", mood: 3 },
  ]);

  return (
    <div>
      <h2>Mood Tracker</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis domain={[0, 5]} />
          <Tooltip />
          <Line type="monotone" dataKey="mood" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodTracker;
