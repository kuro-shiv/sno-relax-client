navigator.geolocation.getCurrentPosition(async (pos) => {
  const { latitude, longitude } = pos.coords;

  // Reverse geocode to get city dynamically (optional)
  let city = "Unknown";
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    const data = await res.json();
    city =
      data.address?.city || data.address?.town || data.address?.village || "Unknown";
  } catch {
    city = "Unknown";
  }

  const payload = {
    firstName,
    lastName,
    email,
    phone,
    city,
    latitude,
    longitude,
  };

  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE || "http://localhost:5000"}/api/auth/create-user`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    console.log("User created or already exists:", data);

    if (data.userId) {
      // Store user info locally and navigate
      localStorage.setItem("sno_userId", data.userId);
      localStorage.setItem("sno_firstName", firstName);
      localStorage.setItem("sno_lastName", lastName);
      localStorage.setItem("sno_email", email);
      localStorage.setItem("sno_phone", phone);
      localStorage.setItem("sno_city", city);
      localStorage.setItem("sno_lat", latitude);
      localStorage.setItem("sno_lon", longitude);

      window.location.href = "/dashboard"; // or use React Router navigate
    } else {
      alert(data.error || "Failed to create user");
    }
  } catch (err) {
    console.error("Error generating ID:", err);
  }
});
