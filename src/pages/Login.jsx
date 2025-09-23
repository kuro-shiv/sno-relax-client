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

  // Get geolocation & detect city
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setLatitude(latitude);
          setLongitude(longitude);

          let detectedCity = "NaN";
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            detectedCity =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              "NaN";
          } catch {
            detectedCity = "NaN";
          }
          setCity(detectedCity);
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

    try {
      // 🔑 Fetch a generated userId from your backend
      const res = await fetch(`${API_BASE}/api/generate-id`);
      const data = await res.json();

      if (!res.ok || !data.userId) {
        setErrorMessage("Failed to generate user ID.");
        return;
      }

      const userId = data.userId;

      // Save all details in localStorage
      localStorage.setItem("sno_userId", userId);
      localStorage.setItem("sno_firstName", firstName.trim());
      localStorage.setItem("sno_lastName", lastName.trim());
      localStorage.setItem("sno_email", email.trim());
      localStorage.setItem("sno_phone", phone.trim());
      localStorage.setItem("sno_city", city);
      localStorage.setItem("sno_lat", latitude ?? 0);
      localStorage.setItem("sno_lon", longitude ?? 0);

      navigate("/dashboard");
    } catch (err) {
      console.error("Error generating ID:", err);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="site-title">🌙 SnoRelax</h1>
        <p className="city-info">📍 Your City: {city}</p>
        <p className="subtitle">Take a deep breath, let’s get you started 🌱</p>

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
