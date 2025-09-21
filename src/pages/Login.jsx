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

  const API_BASE =
    process.env.NODE_ENV === "production"
      ? "https://sno-relax-server-hostside.onrender.com"
      : "http://localhost:5000";

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setLatitude(latitude);
          setLongitude(longitude);

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            setCity(
              data.address?.city ||
                data.address?.town ||
                data.address?.village ||
                "Unknown"
            );
          } catch {
            setCity("Unknown");
          }
        },
        () => setCity("Unknown")
      );
    } else {
      setCity("Unknown");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await fetch(`${API_BASE}/api/auth/create-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          city,
          latitude,
          longitude,
        }),
      });

      if (!res.ok) {
        throw new Error("Network error");
      }

      const data = await res.json();

      if (data.userId) {
        localStorage.setItem("sno_userId", data.userId);
        localStorage.setItem("sno_firstName", firstName);
        localStorage.setItem("sno_lastName", lastName);
        localStorage.setItem("sno_email", email);
        localStorage.setItem("sno_phone", phone);
        localStorage.setItem("sno_city", city);
        localStorage.setItem("sno_lat", latitude);
        localStorage.setItem("sno_lon", longitude);

        navigate("/dashboard");
      } else {
        setErrorMessage(data.error || "Login failed, try again.");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setErrorMessage("Something went wrong. Please try again calmly.");
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
