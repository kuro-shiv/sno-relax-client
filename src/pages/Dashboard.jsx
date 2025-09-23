import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
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

export default function Layout() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("Guest");
  const [city, setCity] = useState("Unknown");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 992);

  useEffect(() => {
    setFirstName(localStorage.getItem("sno_firstName") || "Guest");
    setCity(localStorage.getItem("sno_city") || "Unknown");

    const handleResize = () => setSidebarOpen(window.innerWidth >= 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="d-flex dashboard-container">
      {/* Sidebar */}
      <aside
        className={`sidebar bg-dark text-light ${
          sidebarOpen ? "open" : "closed"
        }`}
      >
        <div className="d-flex flex-column justify-content-between h-100">
          <div>
            <h2 className="logo text-center mb-4">🌙 SnoRelax</h2>
            <nav className="nav flex-column gap-2">
              {[
                { name: "Profile", icon: <User size={18} />, path: "/profile" },
                {
                  name: "Recent Activity",
                  icon: <Activity size={18} />,
                  path: "/chatbot",
                },
                {
                  name: "Mood Tracker",
                  icon: <BookOpen size={18} />,
                  path: "/mood-tracker",
                },
                {
                  name: "Therapist Notes",
                  icon: <Handshake size={18} />,
                  path: "/therapist-notes",
                },
                { name: "Community", icon: <Users size={18} />, path: "/community" },
                { name: "Help", icon: <HelpCircle size={18} />, action: () => alert("Help coming soon") },
                { name: "Settings", icon: <Settings size={18} />, action: () => alert("Settings coming soon") },
              ].map((item, i) => (
                <button
                  key={i}
                  className="btn btn-dark text-start w-100"
                  onClick={() => (item.path ? navigate(item.path) : item.action())}
                >
                  {item.icon} {item.name}
                </button>
              ))}
            </nav>
          </div>
          <div className="text-center mb-2">
            <button className="btn btn-danger w-75" onClick={handleLogout}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 p-3 bg-light min-vh-100">
        {/* Topbar */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <button
            className="btn btn-outline-dark d-lg-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={24} />
          </button>
          <div>
            <h1 className="fw-bold mb-1">
              Welcome, <span className="text-primary">{firstName}</span>
            </h1>
            <p className="text-muted mb-0">📍 {city}</p>
          </div>
        </div>

        {/* Widgets */}
        <div className="row g-3">
          {[
            {
              icon: <Bot size={32} className="text-primary mb-2" />,
              title: "AI Chatbot",
              desc: "Talk with SnoRelax bot for stress relief.",
              action: () => navigate("/chatbot"),
            },
            {
              icon: <BookOpen size={32} className="text-success mb-2" />,
              title: "Mood Tracker",
              desc: "Log your daily mood & monitor changes.",
              action: () => navigate("/mood-tracker"),
            },
            {
              icon: <Handshake size={32} className="text-warning mb-2" />,
              title: "Therapist Guide",
              desc: "View and manage therapist’s notes.",
              action: () => navigate("/therapist-notes"),
            },
            {
              icon: <Hospital size={32} className="text-danger mb-2" />,
              title: "Hospital Reports",
              desc: "Store prescriptions & medical history.",
              action: () => {},
            },
            {
              icon: <HeartPulse size={32} className="text-danger mb-2" />,
              title: "HealthVault",
              desc: "Guideline to stay fit.",
              action: () =>
                window.open(
                  "https://kuro-shiv.github.io/Web_Devlopment/HV/health-vault.html",
                  "_blank"
                ),
            },
            {
              icon: <Users size={32} className="text-info mb-2" />,
              title: "Community",
              desc: "Join groups & connect with others.",
              action: () => navigate("/community"),
            },
          ].map((widget, i) => (
            <div className="col-12 col-sm-6 col-lg-4" key={i}>
              <div
                className="card h-100 shadow-sm p-3 cursor-pointer"
                onClick={widget.action}
              >
                <div className="text-center">{widget.icon}</div>
                <h5 className="card-title text-center mt-2">{widget.title}</h5>
                <p className="card-text text-center text-muted">
                  {widget.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Nested routes content */}
        <Outlet />
      </main>
    </div>
  );
}
