import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ChatbotPage from "./pages/ChatbotPage";
import Profile from "./pages/Profile";
import MoodTrackerPage from "./pages/MoodTrackerPage";
import TherapistNotesPage from "./pages/TherapistNotesPage";
import HealthVault from "./pages/HealthVault";

function App() {
  return (
    <BrowserRouter basename="/SnoRelax">
      <Routes>
        {/* Default homepage → Login */}
        <Route path="/" element={<Login />} />

        {/* Your app pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/health-vault" element={<HealthVault />} />
        <Route path="/mood-tracker" element={<MoodTrackerPage />} />
        <Route path="/therapist-notes" element={<TherapistNotesPage />} />

        {/* Catch-all (redirect everything unknown → Login) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
