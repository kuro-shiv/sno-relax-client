import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Activity, BookOpen, Handshake, Users, HelpCircle,
  Settings, Bot, HeartPulse, Hospital, Menu, LogOut
} from "lucide-react";
import "../styles/Dashboard.css";

export default function Dashboard({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("User");
  const [city, setCity] = useState("Unknown");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setFirstName(localStorage.getItem("sno_firstName") || "User");
    setCity(localStorage.getItem("sno_city") || "Unknown");
  }, []);

  const requireLogin = (path) => {
    const token = localStorage.getItem("authToken");
    if (!token) navigate("/login");
    else navigate(path);
  };

  return (
    <div className="dashboard-container">
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <h2 className="logo">🌙 SnoRelax</h2>
        <nav>
          <button onClick={() => requireLogin("/profile")}><User size={18} /> Profile</button>
          <button onClick={() => requireLogin("/chatbot")}><Activity size={18} /> Recent Activity</button>
          <button onClick={() => requireLogin("/mood-tracker")}><BookOpen size={18} /> Mood Tracker</button>
          <button onClick={() => requireLogin("/therapist-notes")}><Handshake size={18} /> Therapist Notes</button>
          <button onClick={() => requireLogin("/community")}><Users size={18} /> Community</button>
          <button onClick={() => alert("Help coming soon!")}><HelpCircle size={18} /> Help</button>
          <button onClick={() => alert("Settings coming soon!")}><Settings size={18} /> Settings</button>
        </nav>
        <div className="sidebar-footer">
          <button onClick={onLogout}><LogOut size={18} /> Logout</button>
        </div>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <button className={`hamburger ${sidebarOpen ? "active" : ""}`} onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={24} /></button>
          <div>
            <h1>{isLoggedIn ? `Welcome, ${firstName}` : "Welcome, User"}</h1>
            <p className="city">📍 {city}</p>
          </div>
        </div>

        <div className="widgets">
          <div className={`widget ${!isLoggedIn ? "disabled" : ""}`} onClick={() => requireLogin("/chatbot")}><Bot size={28} /><h3>AI Chatbot</h3><p>Talk with SnoRelax bot for stress relief.</p></div>
          <div className={`widget ${!isLoggedIn ? "disabled" : ""}`} onClick={() => requireLogin("/mood-tracker")}><BookOpen size={28} /><h3>Mood Tracker</h3><p>Log your daily mood & monitor changes.</p></div>
          <div className={`widget ${!isLoggedIn ? "disabled" : ""}`} onClick={() => requireLogin("/therapist-notes")}><Handshake size={28} /><h3>Therapist Guide</h3><p>View and manage your therapist’s notes.</p></div>
          <div className={`widget ${!isLoggedIn ? "disabled" : ""}`}><Hospital size={28} /><h3>Hospital Reports</h3><p>Store prescriptions & medical history.</p></div>
          <div className="widget cursor-pointer" onClick={() => {
            const token = localStorage.getItem("authToken");
            if (!token) navigate("/login");
            else window.open("https://kuro-shiv.github.io/Web_Devlopment/HV/health-vault.html", "_blank");
          }}><HeartPulse size={28} /><h3>HealthVault</h3><p>A guideline how to be fit.</p></div>
          <div className={`widget ${!isLoggedIn ? "disabled" : ""}`} onClick={() => requireLogin("/community")}><Users size={28} /><h3>Community</h3><p>Join groups & connect with others.</p></div>
        </div>
      </main>
    </div>
  );
}
