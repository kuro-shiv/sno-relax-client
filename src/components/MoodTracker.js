import { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

export default function MoodTrackerPage() {
  const [mood, setMood] = useState(null);
  const [note, setNote] = useState("");
  const [moodHistory, setMoodHistory] = useState([]);
  const userId = "123"; // Replace with actual logged-in user ID

  // Fetch moods
  useEffect(() => {
    fetchMoods();
  }, []);

  const fetchMoods = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/moodtracker/${userId}`);
      setMoodHistory(res.data.moods || []);
    } catch (err) {
      console.error("Failed to load moods", err);
    }
  };

  const handleMoodSubmit = async () => {
    if (!mood) return alert("Please select your mood");

    try {
      await axios.post(`http://localhost:5000/api/moodtracker/${userId}`, {
        mood,
        note,
      });
      setMood(null);
      setNote("");
      fetchMoods();
    } catch (err) {
      console.error("Error saving mood", err);
    }
  };

  // Chart Data
  const chartData = moodHistory.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    mood: entry.mood,
  }));

  // Mood frequency count
  const moodCount = [1, 2, 3, 4, 5].map((value) => ({
    mood: ["😡", "😕", "😐", "🙂", "😄"][value - 1],
    count: moodHistory.filter((m) => m.mood === value).length,
  }));

  // Average mood
  const averageMood =
    moodHistory.length > 0
      ? (
          moodHistory.reduce((acc, m) => acc + m.mood, 0) / moodHistory.length
        ).toFixed(1)
      : null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center text-gray-800 p-4 sm:p-6 md:p-10">
      {/* Header */}
      <header className="w-full max-w-3xl text-center mt-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-blue-700 drop-shadow-sm">
          Mood Tracker 😊
        </h1>
        <p className="text-gray-600 mt-2 text-base sm:text-lg">
          Track, visualize, and understand your emotions
        </p>
      </header>

      {/* Mood Selector */}
      <div className="flex flex-col items-center mt-10 space-y-5 bg-white shadow-lg p-6 rounded-3xl w-[95vw] sm:w-[80vw] md:w-[60vw]">
        <h2 className="text-xl font-semibold text-gray-700">How do you feel today?</h2>

        <div className="grid grid-cols-5 gap-4 text-4xl">
          {["😡", "😕", "😐", "🙂", "😄"].map((emoji, index) => (
            <button
              key={index}
              onClick={() => setMood(index + 1)}
              className={`p-3 sm:p-4 rounded-2xl transition-transform transform hover:scale-110 shadow-md ${
                mood === index + 1
                  ? "bg-blue-100 scale-110 border-2 border-blue-500"
                  : "bg-gray-50 hover:bg-blue-50"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>

        <textarea
          className="w-[90%] mt-6 p-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Add a note (optional)..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>

        <button
          onClick={handleMoodSubmit}
          className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-xl text-lg font-medium hover:bg-blue-700 transition-all"
        >
          Save Mood
        </button>
      </div>

      {/* Summary Cards */}
      <div className="flex flex-wrap justify-center gap-6 mt-10 w-full max-w-4xl">
        <div className="bg-white p-6 rounded-2xl shadow-md w-[280px] text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Average Mood</h3>
          <p className="text-5xl">
            {averageMood ? ["😡", "😕", "😐", "🙂", "😄"][Math.round(averageMood) - 1] : "–"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {averageMood ? `Score: ${averageMood}/5` : "No data yet"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md w-[280px] text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Entries</h3>
          <p className="text-4xl text-blue-600">{moodHistory.length}</p>
          <p className="text-sm text-gray-500 mt-1">Days tracked</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="w-full max-w-5xl mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Line Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-md">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Mood Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis domain={[1, 5]} stroke="#64748b" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-md">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Mood Frequency</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={moodCount}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mood" stroke="#64748b" />
              <YAxis allowDecimals={false} stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="count" fill="#60a5fa" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mood History */}
      <section className="w-full max-w-3xl mt-12 mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-700">
          Recent Mood Entries
        </h2>
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[40vh] sm:max-h-[50vh] px-2">
          {moodHistory.length === 0 ? (
            <p className="text-gray-400 text-center">No moods recorded yet.</p>
          ) : (
            moodHistory
              .slice(-10)
              .reverse()
              .map((entry) => (
                <div
                  key={entry._id}
                  className="w-full p-3 sm:p-4 rounded-xl bg-white shadow-sm border border-gray-100 flex justify-between items-center hover:bg-blue-50 transition-all"
                >
                  <span className="text-2xl">
                    {["😡", "😕", "😐", "🙂", "😄"][entry.mood - 1]}
                  </span>
                  <div className="flex flex-col text-right">
                    <span className="text-sm sm:text-base text-gray-600">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                    {entry.note && (
                      <span className="text-xs sm:text-sm text-gray-500 italic truncate max-w-[200px]">
                        {entry.note}
                      </span>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>
      </section>
    </div>
  );
}
