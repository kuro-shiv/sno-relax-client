import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Detecting...");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Get user location and convert to city
  useEffect(() => {
    const getCityFromCoords = async (lat, lon) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );
        const data = await res.json();
        return data.address.city || data.address.town || data.address.village || "Unknown";
      } catch {
        return "Unknown";
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          const { latitude, longitude } = pos.coords;
          setLatitude(latitude);
          setLongitude(longitude);

          const detectedCity = await getCityFromCoords(latitude, longitude);
          setCity(detectedCity);
        }, () => setErrorMessage("Please allow location to continue."));
      } else {
        setErrorMessage("Geolocation not supported by your browser.");
      }
    };

    getLocation();
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!firstName || !lastName || !email || !phone) {
      setErrorMessage("Please fill all required fields.");
      return;
    }

    if (!city || city === "Detecting...") {
      setErrorMessage("Waiting for location. Please allow location access.");
      return;
    }

    try {
      // Replace this with your backend API call
      const fakeApiResponse = { userId: "12345", token: "logged-in" };

      localStorage.setItem("sno_userId", fakeApiResponse.userId);
      localStorage.setItem("sno_firstName", firstName.trim());
      localStorage.setItem("sno_lastName", lastName.trim());
      localStorage.setItem("sno_email", email.trim());
      localStorage.setItem("sno_phone", phone.trim());
      localStorage.setItem("sno_city", city);
      localStorage.setItem("sno_lat", latitude);
      localStorage.setItem("sno_lon", longitude);
      localStorage.setItem("authToken", fakeApiResponse.token);

      onLogin(fakeApiResponse.token);
      navigate("/");
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="site-title">🌙 SnoRelax</h1>
        <p className="city-info">📍 Your City: {city}</p>
        <p className="subtitle">Take a deep breath, let’s get you started 🌱</p>

        <form onSubmit={handleLoginSubmit}>
          <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required />
          <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="tel" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} required />
          <button type="submit" disabled={!latitude || !longitude}>Login</button>
        </form>

        {errorMessage && <p className="error-message">⚠️ {errorMessage}</p>}
      </div>
    </div>
  );
}
