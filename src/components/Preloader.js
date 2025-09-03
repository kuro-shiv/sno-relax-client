// src/components/Preloader.js
import React, { useEffect, useState } from "react";

export default function Preloader({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // 2 sec preloader
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <iframe
        src="/og-image.html"
        style={{ width: "100%", height: "100vh", border: "none" }}
      ></iframe>
    );
  }

  return children;
}
