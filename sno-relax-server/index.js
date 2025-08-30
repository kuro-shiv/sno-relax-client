const express = require("express");
const crypto = require("crypto");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("✅ Sno-Relax backend is running!");
});

app.post("/api/generate-id", (req, res) => {
  try {
    const { firstName, lastName, email, phone, location } = req.body;

    console.log("📩 Incoming body:", req.body);

    // ✅ Basic required fields
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({
        error: "All fields (firstName, lastName, email, phone) are required",
      });
    }

    // ✅ Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // ✅ Phone validation (10–15 digits, allows country code)
    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    // ✅ Generate user ID
    const initials = `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`;
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();

    // Stronger randomness (hex → uppercase)
    const code = crypto.randomBytes(3).toString("hex").toUpperCase(); // e.g. "A1F3B2"

    // ✅ Location handling (string or object)
    let locCode = "XXX";
    if (typeof location === "string" && location.trim() !== "") {
      locCode = location.slice(0, 3).toUpperCase();
    } else if (typeof location === "object" && location !== null) {
      const locString = Object.values(location)[0]; // e.g. { city: "Delhi" }
      if (typeof locString === "string") {
        locCode = locString.slice(0, 3).toUpperCase();
      }
    }

    const userId = `${initials}-${month}-${year}-${locCode}-${code}`;

    console.log("✅ New User Registered:", { userId, email, phone, location });

    return res.json({ ok: true, userId });
  } catch (err) {
    console.error("❌ Error generating user ID:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Example: start server
app.listen(4000, () => {
  console.log("🚀 Server running on http://localhost:4000");
});
