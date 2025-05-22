import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios, { Axios } from "axios";
import "../styles/global.css";

const backendUrl = "http://localhost:4000";

export default function Home() {
  const [apk, setApk] = useState(null);
  const [newDevice, setNewDevice] = useState(null);
  const [deviceName, setDeviceName] = useState("");
  const [deviceModel, setDeviceModel] = useState("");



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


  const getdevice = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/adb/get-devices`);
      if (!response.data.device) return alert(response.data.message || "No device found");

      setNewDevice(response.data.device);
      setDeviceModel(response.data.device);

    } catch (err) {
      console.error("Error fetching device:", err);
      alert("Failed to get device");
    }
  };

  const addDeviceId = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/adb/add`, {
        newEntry: {
          name: deviceName,
          ID: deviceModel
        }
      });
      alert(response.data.message);
    } catch (error) {

      const errorMessage = error.response?.data?.error || "Something went wrong";
      alert(`Failed to add device: ${errorMessage}`);

    }
  };

  return (

    <div className="container">
      <h2>📱 Binogi Test Automation</h2>
      

      {apk && (
        <div className="apk-info">
          <p><strong>Selected File:</strong> {apk.name}</p>
          <p><strong>Size:</strong> {(apk.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      )}

      <label className="upload-label">
        📂 Choose APK
        <input
          type="file"
          accept=".apk"
          onChange={(e) => setApk(e.target.files[0])}
        />
      </label>



      <button onClick={uploadAPK}>🚀 Upload APK</button>

      <hr />

      {newDevice && (
        <div className="apk-info">


          <input
            type="text"
            placeholder="Device Name"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Device Model"
            value={newDevice}
            onChange={(e) => setDeviceModel(e.target.value)}
          />
          <button onClick={addDeviceId}>Add Device</button>
        </div>
      )}

      <button onClick={getdevice}>Get New Device</button>

      <Link to="/testcases">🧪 View and Run Test Cases</Link>
      <Link to="/translations">🌍 Translations</Link>
    </div>
  );
}
