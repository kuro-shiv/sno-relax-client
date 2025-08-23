import React, { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [data, setData] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/data")
      .then(res => setData(res.data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container text-center mt-5">
      <h1>Welcome to SnoRelax</h1>
      <p>{data}</p>
    </div>
  );
}
export default Home;
