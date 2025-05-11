const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const { broadcastMessage, setProcess } = require("../websocket/wsServer");
const {
  pullTracesFile,
  checkANRFromFileAndSave,
} = require("../tests/utils/anrUtils");
const {
  streamGrowthExperimentLogs,
} = require("../tests/utils/growthbookUtils");
const { spawn } = require("child_process");



const router = express.Router();
let testProcess = null;

// Start any test by path
router.post("/start", (req, res) => {
  
  if (testProcess) {
    return res.status(400).json({success: false, message: "⚠️ A test is already running" });
  }

  const scriptPath = req.body?.script;
  if (!scriptPath) {
    return res.status(400).json({success: false, message: "❌ No script specified" });
  }

  const resolvedScript = path.resolve(__dirname, "../", scriptPath);
  testProcess = spawn("node", [resolvedScript]);

  setProcess(testProcess);

  testProcess.stdout.on("data", (data) => {
    const cleanLines = data
  .toString()
  .split("\n")
  .filter((line) => {
    const trimmed = line.trim();
    return (
      trimmed.startsWith("✅") ||
      trimmed.startsWith("❌") ||
      trimmed.startsWith("▶") ||
      trimmed.startsWith("⛔") ||
      trimmed.startsWith("📢") ||
      trimmed.startsWith("🧪") ||
      trimmed.startsWith("⚠️") ||
      trimmed.startsWith("🔁") ||
      trimmed.startsWith("🏠") ||
      trimmed.startsWith("🟢") ||
      trimmed.startsWith("📋")
    );
  });

    cleanLines.forEach((line) => broadcastMessage(`📢 ${line}`));
  });

  testProcess.stderr.on("data", (error) => {
    const formatted = error.toString().trim();
    console.error("🔴 STDERR:", formatted);
    // broadcastMessage(`❌ Script Error Output:\n${formatted}`);
  });

  // 🌟 Start logcat watcher for experiment logs
  logcatStream = streamGrowthExperimentLogs((logLine) => {
    broadcastMessage(`🧪 ${logLine}`);
  });

  testProcess.on("exit", async (code) => {
    const testName = path.basename(scriptPath).replace(".js", "");

    pullTracesFile((err, tracePath) => {
      if (err) {
        // broadcastMessage("⚠️ Could not pull ANR traces");
      } else {
        const hasAnr = checkANRFromFileAndSave(
          tracePath,
          "com.binogi",
          testName,
        );
        if (hasAnr) {
          broadcastMessage(
            `❌ ANR Detected! Saved to logs/anr-traces/${testName}-<timestamp>.txt`,
          );
        } else {
          broadcastMessage(`✅ Test finished with exit code ${code}`);
        }
      }
      // 🧼 Kill logcat stream when test ends
      if (logcatStream) {
        logcatStream.kill();
        logcatStream = null;
      }

      testProcess = null;
      setProcess(null);
    });
  });

  res.json({success: true, message: `🚀 Started test: ${scriptPath}` });
});

// Stop currently running test
router.post("/stop", (req, res) => {
  if (!testProcess) {
    return res.status(400).json({success: false, message: "⚠️ No test is running" });
  }

  testProcess.kill("SIGTERM");
  testProcess = null;
  setProcess(null);
  broadcastMessage("⛔ Test stopped by user.");
  res.json({success: true, message: "⛔ Test Stopped" });
});

module.exports = router;
