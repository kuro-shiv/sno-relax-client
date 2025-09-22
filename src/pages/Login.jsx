import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Detecting...");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  useEffect(() => {
    const fetchCity = async (lat, lon) => {
      try {
        const res = await fetch(`${API_BASE}/api/location`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ latitude: lat, longitude: lon }),
        });
        const data = await res.json();
        setCity(data.city || "NaN");
      } catch {
        setCity("NaN");
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          fetchCity(latitude, longitude);
        },
        () => setCity("NaN")
      );
    } else {
      setCity("NaN");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!firstName || !lastName || !email || !phone) {
      setErrorMessage("Please fill all required fields.");
      return;
    }

    const payload = {
      firstName,
      lastName,
      email,
      phone,
      city,
      latitude: latitude ?? 0,
      longitude: longitude ?? 0,
    };

    try {
      const res = await fetch(`${API_BASE}/api/auth/create-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok && data.error !== "User already exists") {
        setErrorMessage(data.error || "Login failed.");
        return;
      }

      // Save user locally
      localStorage.setItem("sno_userId", data.userId || data.user?.userId);
      localStorage.setItem("sno_firstName", firstName);
      localStorage.setItem("sno_lastName", lastName);
      localStorage.setItem("sno_email", email);
      localStorage.setItem("sno_phone", phone);
      localStorage.setItem("sno_city", city);
      localStorage.setItem("sno_lat", latitude ?? 0);
      localStorage.setItem("sno_lon", longitude ?? 0);

      navigate("/dashboard");
    } catch (err) {
      console.error("Error logging in:", err);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="site-title">🌙 SnoRelax</h1>
        <p className="city-info">📍 Your City: {city}</p>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        {errorMessage && <p className="error-message">⚠️ {errorMessage}</p>}
      </div>
    </div>
  );
}
