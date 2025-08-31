import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const userId = localStorage.getItem("sno_userId");

  return (
    <Router>
      <Routes>
        <Route path="/" element={userId ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard" element={userId ? <Dashboard /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
