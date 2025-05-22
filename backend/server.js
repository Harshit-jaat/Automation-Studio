const express = require("express");
const path = require("path");
const os = require("os");
const axios = require("axios");
const { initWebSocket } = require("./websocket/wsServer");
const { startAppium, stopAppium } = require("./config/appiumstarter");
const cors = require("cors");
const {getConnectedDevice} = require("./config/devicesutils");


const PORT = 4000;
const app = express();

// Middleware
app.use(express.static("public"));
app.use("/backend/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/backend/strings", express.static(path.join(__dirname, "strings")));
app.use("/backend/tests", express.static(path.join(__dirname, "tests")));
app.use(express.json());
app.use(cors());

// API Routes
app.use("/upload", require("./routes/upload"));
app.use("/test", require("./routes/test"));
app.use("/api", require("./routes/translation"));
app.use("/api/testcases", require("./routes/testcases"));
app.use("/api/adb",require("./routes/adb-devices"));

app.get("/", (req, res) => {
  res.json({ success: true, message: "Automation Studio backend running" });
});
app.get("/api/healthcheck", (req, res) => {
  res.status(200).send("OK");
});

app.get("/api/testcases-all", async (req, res) => {
  try {
    const baseURL = `http://localhost:${PORT}`;
    const { data } = await axios.get(`${baseURL}/api/testcases`);
    res.json({ success: true, testCases: data.testCases });
  } catch (err) {
    console.error("❌ Failed to load test cases", err);
    res.json({ success: false, testCases: [] });
  }
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log("🚀 Backend ready on port 4000");

  // Start Appium
  startAppium();

  // Start WebSocket
  initWebSocket(server);
  getConnectedDevice();
});

// Graceful Shutdown
function shutdown() {
  console.log("⛔ Backend stopping... Stopping Appium...");
  stopAppium();

  server.close(() => {
    console.log("✅ Backend server closed.");
    process.exit(0);
  });

  // Force exit if not closed after 5s
  setTimeout(() => {
    console.warn("❗ Force exiting backend.");
    process.exit(1);
  }, 5000);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("exit", shutdown);
