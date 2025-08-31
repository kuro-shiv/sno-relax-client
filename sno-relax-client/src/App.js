import { BrowserRouter, Routes, Route } from "react-router-dom";
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
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/mood-tracker" element={<MoodTrackerPage />} />
        <Route path="/therapist-notes" element={<TherapistNotesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
