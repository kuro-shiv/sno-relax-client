import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ChatbotPage from "./pages/ChatbotPage";
import Profile from "./pages/Profile";
import MoodTrackerPage from "./pages/MoodTrackerPage";
import TherapistNotesPage from "./pages/TherapistNotesPage";
import CommunityPage from "./pages/CommunityPage"; // ✅ import

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/mood-tracker" element={<MoodTrackerPage />} />
        <Route path="/therapist-notes" element={<TherapistNotesPage />} />
        <Route path="/community" element={<CommunityPage />} /> 
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
