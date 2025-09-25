import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ChatbotPage from "./pages/ChatbotPage";
import Profile from "./pages/Profile";
import MoodTrackerPage from "./pages/MoodTrackerPage";
import TherapistNotesPage from "./pages/TherapistNotesPage";
import CommunityPage from "./pages/CommunityPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ keep login state persistent
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) setIsLoggedIn(true);
  }, []);

  // ✅ save login
  const handleLogin = (token) => {
    localStorage.setItem("authToken", token);
    setIsLoggedIn(true);
  };

  // ✅ logout (optional)
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ default page is Dashboard */}
        <Route path="/" element={<Dashboard isLoggedIn={isLoggedIn} />} />

        {/* ✅ login page */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* ✅ protected routes */}
        <Route
          path="/chatbot"
          element={isLoggedIn ? <ChatbotPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/mood-tracker"
          element={isLoggedIn ? <MoodTrackerPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/therapist-notes"
          element={isLoggedIn ? <TherapistNotesPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/community"
          element={isLoggedIn ? <CommunityPage /> : <Navigate to="/login" />}
        />

        {/* ✅ fallback redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
