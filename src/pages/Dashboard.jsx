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
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    setFirstName(localStorage.getItem("sno_firstName") || "Guest");
    setCity(localStorage.getItem("sno_city") || "Unknown");
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-light"
        style={{ width: "250px", minHeight: "100vh" }}
      >
        <h2 className="text-primary text-center mb-4">🌙 SnoRelax</h2>
        <ul className="nav nav-pills flex-column mb-auto">
          <li>
            <button className="btn btn-dark text-start w-100" onClick={() => navigate("/profile")}>
              <User size={18} /> Profile
            </button>
          </li>
          <li>
            <button className="btn btn-dark text-start w-100" onClick={() => navigate("/chatbot")}>
              <Activity size={18} /> Recent Activity
            </button>
          </li>
          <li>
            <button className="btn btn-dark text-start w-100" onClick={() => navigate("/mood-tracker")}>
              <BookOpen size={18} /> Mood Tracker
            </button>
          </li>
          <li>
            <button className="btn btn-dark text-start w-100" onClick={() => navigate("/therapist-notes")}>
              <Handshake size={18} /> Therapist Notes
            </button>
          </li>
          <li>
            <button className="btn btn-dark text-start w-100" onClick={() => navigate("/community")}>
              <Users size={18} /> Community
            </button>
          </li>
          <li>
            <button className="btn btn-dark text-start w-100" onClick={() => alert("Help section coming soon!")}>
              <HelpCircle size={18} /> Help
            </button>
          </li>
          <li>
            <button className="btn btn-dark text-start w-100" onClick={() => alert("Settings coming soon!")}>
              <Settings size={18} /> Settings
            </button>
          </li>
        </ul>
        <hr />
        <div>
          <button className="btn btn-danger w-100" onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4 bg-light">
        {/* Topbar */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>
            Welcome, <span className="text-primary">{firstName}</span>
          </h1>
          <p className="text-muted">📍 {city}</p>
        </div>

        {/* Widgets */}
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm" onClick={() => navigate("/chatbot")}>
              <div className="card-body text-center">
                <Bot size={32} className="mb-2 text-primary" />
                <h5 className="card-title">AI Chatbot</h5>
                <p className="card-text">Talk with SnoRelax bot for stress relief.</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm" onClick={() => navigate("/mood-tracker")}>
              <div className="card-body text-center">
                <BookOpen size={32} className="mb-2 text-success" />
                <h5 className="card-title">Mood Tracker</h5>
                <p className="card-text">Log your daily mood & monitor changes.</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm" onClick={() => navigate("/therapist-notes")}>
              <div className="card-body text-center">
                <Handshake size={32} className="mb-2 text-warning" />
                <h5 className="card-title">Therapist Guide</h5>
                <p className="card-text">View and manage your therapist’s notes.</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <Hospital size={32} className="mb-2 text-danger" />
                <h5 className="card-title">Hospital Reports</h5>
                <p className="card-text">Store prescriptions & medical history.</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="card h-100 shadow-sm cursor-pointer"
              onClick={() =>
                window.open(
                  "https://kuro-shiv.github.io/Web_Devlopment/HV/health-vault.html",
                  "_blank"
                )
              }
            >
              <div className="card-body text-center">
                <HeartPulse size={32} className="mb-2 text-danger" />
                <h5 className="card-title">HealthVault</h5>
                <p className="card-text">A guideline how to be fit.</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm" onClick={() => navigate("/community")}>
              <div className="card-body text-center">
                <Users size={32} className="mb-2 text-info" />
                <h5 className="card-title">Community</h5>
                <p className="card-text">Join groups & connect with others.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
