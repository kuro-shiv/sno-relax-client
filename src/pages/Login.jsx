import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  useEffect(() => {
    const fetchCityFromCoords = async (lat, lon) => {
      try {
        const res = await fetch(`${API_BASE}/api/location`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ latitude: lat, longitude: lon }),
        });
        const data = await res.json();
        return data.city || "NaN";
      } catch {
        return "NaN";
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            setLatitude(latitude);
            setLongitude(longitude);
            const detectedCity = await fetchCityFromCoords(latitude, longitude);
            setCity(detectedCity);
          },
          () => setErrorMessage("Please allow location to continue.")
        );
      } else {
        setErrorMessage("Geolocation not supported by your browser.");
      }
    };

    getLocation();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!firstName || !lastName || !email || !phone) {
      setErrorMessage("Please fill all required fields.");
      return;
    }

    if (!city || city === "") {
      setErrorMessage("Waiting for location. Please allow location access.");
      return;
    }

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
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Registration failed");
        return;
      }

      // ✅ Save user info
      localStorage.setItem("sno_userId", data.userId);
      localStorage.setItem("sno_firstName", firstName.trim());
      localStorage.setItem("sno_lastName", lastName.trim());
      localStorage.setItem("sno_email", email.trim());
      localStorage.setItem("sno_phone", phone.trim());
      localStorage.setItem("sno_city", city);
      localStorage.setItem("sno_lat", latitude);
      localStorage.setItem("sno_lon", longitude);

      // ✅ Mark as logged in (persistent)
      if (data.token) {
        // if backend sends JWT/session token
        localStorage.setItem("authToken", data.token);
      } else {
        // fallback simple flag
        localStorage.setItem("authToken", "logged-in");
      }

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="site-title">🌙 SnoRelax</h1>
        <p className="city-info">📍 Your City: {city || "Detecting..."}</p>
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
          <button type="submit" disabled={!city || !latitude || !longitude}>
            Login
          </button>
        </form>

        {errorMessage && (
          <p className="error-message">⚠️ {errorMessage}</p>
        )}
      </div>
    </div>
  );
}
