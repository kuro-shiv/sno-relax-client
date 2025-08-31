import React, { useState, useEffect } from "react";

function Login() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
        },
        (err) => {
          console.warn("Location error:", err.message);
        }
      );
    }
  }, []);

  const handleLogin = async () => {
    if (!firstName || !lastName || !email || !phone) {
      alert("All fields are required");
      return;
    }

    if (!email.endsWith("@gmail.com")) {
      alert("Please enter a valid Gmail ID");
      return;
    }

    if (!/^\+?[0-9]{10,15}$/.test(phone)) {
      alert("Enter a valid phone number (10–15 digits, optional +)");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/generate-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, phone, location }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong");
        return;
      }

      if (data.userId) {
        localStorage.setItem("sno_userId", data.userId);
        window.location.href = "/dashboard"; // ✅ Redirect to dashboard
      }
    } catch (err) {
      console.error(err);
      alert("Error generating ID");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🧠 Sno-Relax Login</h1>
        <p style={styles.subtitle}>Secure Anonymous Access</p>

        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          style={styles.input}
        />
        <input
          type="email"
          placeholder="Gmail ID"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleLogin} style={styles.button} disabled={loading}>
          {loading ? "Verifying..." : "Login & Generate ID"}
        </button>
      </div>
    </div>
  );
}

const styles = { /* keep your styles from App.js */ };

export default Login;
