// src/pages/Login.js
import React, { useState, useEffect } from "react";
import "../styles/Login.css";

export default function Login() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Detecting...");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  // ✅ Detect city + coords
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
            if (data.address?.city) {
              setCity(data.address.city);
            } else if (data.address?.town) {
              setCity(data.address.town);
            } else if (data.address?.village) {
              setCity(data.address.village);
            } else {
              setCity("NAN"); // fallback
            }
          } catch (err) {
            setCity("NAN");
          }
        },
        () => setCity("NAN")
      );
    } else {
      setCity("NAN");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, phone, city, latitude, longitude }),
      });

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

        window.location.href = "/dashboard";
      } else {
        alert("Login failed, try again.");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      alert("Something went wrong.");
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
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
