import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

const backendUrl = "http://localhost:4000";

export default function Home() {
  const [apk, setApk] = useState(null);

  const uploadAPK = async () => {
    if (!apk) return alert("Select APK first");

    const formData = new FormData();
    formData.append("apk", apk);

    try {
      const res = await axios.post(`${backendUrl}/upload`, formData);
      alert(res.data.message);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed");
    }
  };

  return (
    <div className="container">
      <h2>📱 Binogi Test Automation</h2>

      <label className="upload-label">
        📂 Choose APK
        <input type="file" onChange={(e) => setApk(e.target.files[0])} />
      </label>

      <button onClick={uploadAPK}>🚀 Upload APK</button>

      <hr />

      <Link to="/testcases">🧪 View and Run Test Cases</Link>
      <Link to="/translations">🌍 Translations</Link>
    </div>
  );
}
