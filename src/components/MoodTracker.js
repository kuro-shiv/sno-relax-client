import { useState, useEffect } from "react";
import axios from "axios";

export default function MoodTrackerPage() {
  const [mood, setMood] = useState(null);
  const [note, setNote] = useState("");
  const [moodHistory, setMoodHistory] = useState([]);
  const userId = "123"; // 🔧 Replace with actual logged-in user ID

  // ✅ Fetch user moods
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

  return (
    <div className="min-h-screen w-full bg-white flex flex-col justify-between items-center text-gray-800 p-4 sm:p-6 md:p-10">
      
      {/* Header */}
      <header className="w-full max-w-3xl text-center mt-6">
        <h1 className="text-3xl sm:text-4xl font-semibold text-blue-600">
          Mood Tracker 😊
        </h1>
        <p className="text-gray-500 mt-2 text-base sm:text-lg">
          Track your daily mood and stay mindful
        </p>
      </header>

      {/* Mood Selector */}
      <div className="flex flex-col items-center mt-8 space-y-4">
        <div className="grid grid-cols-5 gap-4 text-3xl sm:text-4xl">
          {["😡", "😕", "😐", "🙂", "😄"].map((emoji, index) => (
            <button
              key={index}
              onClick={() => setMood(index + 1)}
              className={`p-3 sm:p-4 rounded-2xl shadow-md hover:scale-110 transition-transform duration-150 ${
                mood === index + 1 ? "bg-blue-100 scale-110" : "bg-gray-50"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>

        <textarea
          className="w-[90vw] sm:w-[70vw] md:w-[50vw] mt-6 p-3 border border-gray-300 rounded-xl text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Add a note (optional)..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>

        <button
          onClick={handleMoodSubmit}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-medium hover:bg-blue-700 transition-all"
        >
          Save Mood
        </button>
      </div>

      {/* History Section */}
      <section className="w-full max-w-3xl mt-10 mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-700">
          Your Recent Moods
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
                  key={entry.id || entry._id}
                  className="w-full p-3 sm:p-4 rounded-xl bg-gray-50 shadow-sm border border-gray-200 flex justify-between items-center"
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
