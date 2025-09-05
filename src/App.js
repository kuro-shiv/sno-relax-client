import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ChatbotPage from "./pages/ChatbotPage";
import Profile from "./pages/Profile";
import MoodTrackerPage from "./pages/MoodTrackerPage";
import TherapistNotesPage from "./pages/TherapistNotesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default homepage → Login */}
        <Route path="/" element={<Login />} />

        {/* Your app pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/health-vault"
          element={<Navigate to="/health-vault.html" />}
        />
        <Route path="/mood-tracker" element={<MoodTrackerPage />} />
        <Route path="/therapist-notes" element={<TherapistNotesPage />} />

        {/* Catch-all (redirect everything unknown → Login) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
