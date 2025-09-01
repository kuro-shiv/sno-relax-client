navigator.geolocation.getCurrentPosition(async (pos) => {
  const { latitude, longitude } = pos.coords;

  // If you also want city, use a reverse geocoding API before sending
  const location = { lat: latitude, lon: longitude, city: "New Delhi" };

  await fetch("http://localhost:4000/api/generate-id", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, lastName, email, phone, location }),
  });
});
