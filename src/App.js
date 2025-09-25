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

  // ✅ Check login state on app load
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) setIsLoggedIn(true);
  }, []);

  // ✅ Handle login
  const handleLogin = (token) => {
    localStorage.setItem("authToken", token);
    setIsLoggedIn(true);
  };

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Default page is Dashboard */}
        <Route
          path="/"
          element={<Dashboard isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
        />

        {/* Login page */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Protected routes */}
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

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
