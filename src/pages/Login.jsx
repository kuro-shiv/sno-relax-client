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

  // Get geolocation (phone/browser location) and fallback to NaN
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
                "NaN"
            );
          } catch {
            setCity("NaN");
          }
        },
        () => setCity("NaN") // If user denies permission or error occurs
      );
    } else {
      setCity("NaN"); // Browser doesn't support geolocation
    }
  }, []);

  // Handle login / form submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!firstName || !lastName || !email || !phone) {
      setErrorMessage("Please fill all required fields.");
      return;
    }

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
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
      console.log("Server response:", data);

      if (!res.ok && data.error !== "User already exists") {
        setErrorMessage(data.error || "Login failed.");
        return;
      }

      // Store user data locally
      const userId = data.userId || data.user?.userId;
      localStorage.setItem("sno_userId", userId);
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
