import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  Activity,
  HelpCircle,
  Users,
  BookOpen,
  HeartPulse,
  Hospital,
  Handshake,
  Bot,
  Menu,
  LogOut,
} from "lucide-react";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [city, setCity] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setFirstName(localStorage.getItem("sno_firstName") || "Guest");
    setCity(localStorage.getItem("sno_city") || "Unknown");

    if (window.innerWidth >= 1024) setSidebarOpen(true);

    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <h2 className="logo">🌙 SnoRelax</h2>
        <nav>
          <button onClick={() => navigate("/profile")}>
            <User size={18} /> Profile
          </button>
          <button onClick={() => navigate("/chatbot")}>
            <Activity size={18} /> Recent Activity
          </button>
          <button onClick={() => navigate("/mood-tracker")}>
            <BookOpen size={18} /> Mood Tracker
          </button>
          <button onClick={() => navigate("/therapist-notes")}>
            <Handshake size={18} /> Therapist Notes
          </button>
          <button onClick={() => navigate("/community")}>
            <Users size={18} /> Community
          </button>
          <button onClick={() => alert("Help section coming soon!")}>
            <HelpCircle size={18} /> Help
          </button>
          <button onClick={() => alert("Settings coming soon!")}>
            <Settings size={18} /> Settings
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <div className="topbar">
          <button
            className={`hamburger ${sidebarOpen ? "active" : ""}`}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={24} />
          </button>
          <div>
            <h1>
              Welcome, <span className="highlight">{firstName}</span>
            </h1>
            <p className="city">📍 {city}</p>
          </div>
        </div>

        {/* Widgets */}
        <div className="widgets">
          <div className="widget" onClick={() => navigate("/chatbot")}>
            <Bot size={28} />
            <h3>AI Chatbot</h3>
            <p>Talk with SnoRelax bot for stress relief.</p>
          </div>

          <div className="widget" onClick={() => navigate("/mood-tracker")}>
            <BookOpen size={28} />
            <h3>Mood Tracker</h3>
            <p>Log your daily mood & monitor changes.</p>
          </div>

          <div className="widget" onClick={() => navigate("/therapist-notes")}>
            <Handshake size={28} />
            <h3>Therapist Guide</h3>
            <p>View and manage your therapist’s notes.</p>
          </div>

          <div className="widget">
            <Hospital size={28} />
            <h3>Hospital Reports</h3>
            <p>Store prescriptions & medical history.</p>
          </div>

          <div
            className="widget cursor-pointer"
            onClick={() =>
              window.open(
                "https://kuro-shiv.github.io/Web_Devlopment/HV/health-vault.html",
                "_blank"
              )
            }
          >
            <HeartPulse size={28} />
            <h3>HealthVault</h3>
            <p>A guideline how to be fit.</p>
          </div>

          <div className="widget" onClick={() => navigate("/community")}>
            <Users size={28} />
            <h3>Community</h3>
            <p>Join groups & connect with others.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
