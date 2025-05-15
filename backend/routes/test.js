const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { broadcastMessage, setProcess } = require("../websocket/wsServer");
const {
  pullTracesFile,
  checkANRFromFileAndSave,
  collectLogcatErrors,
} = require("../tests/utils/anrUtils");
const {
  streamGrowthExperimentLogs,
} = require("../tests/utils/growthbookUtils");
const { spawn } = require("child_process");
const  {startSession, addTestResult, setDeviceInfo, endSession } = require ("../config/sessionmanager");
const {
  getConnectedDevice,
  getLatestAPK,
  getDeviceInfoViaADB
} = require("../config/devicesutils");
const { generatePDFReport } = require("../tests/utils/pdfgenerator");




const router = express.Router();
let testProcess = null;




// Start test 
router.post("/start", (req, res) => {
  
  if (testProcess) {
    return res.status(400).json({success: false, message: "⚠️ A test is already running" });
  }

  const scriptPath = req.body?.script;
  if (!scriptPath) {
    return res.status(400).json({success: false, message: "❌ No script specified" });
  }

  const resolvedScript = path.resolve(__dirname, "../", scriptPath);
  let collectedLogLines = [];
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

  collectedLogLines.push(...cleanLines);

  cleanLines.forEach((line) => broadcastMessage(`📢 ${line}`));
  });


  testProcess.stderr.on("data", (error) => {
    const formatted = error.toString().trim();
    console.error("🔴 STDERR:", formatted);
    console.log("🔴", formatted)
    // broadcastMessage(`❌ Script Error Output:\n${formatted}`);
  });


  logcatStream = streamGrowthExperimentLogs((logLine) => {
    broadcastMessage(`🧪 ${logLine}`);
  });

  testProcess.on("exit", async (code) => {
  const testName = path.basename(scriptPath).replace(".js", "");

  const testResult = {
    testName,
    scriptPath,
    status: code === 0 ? "passed" : "failed",
    logs: collectedLogLines.join("\n"),
    logcatErrors: await collectLogcatErrors()
  };

  addTestResult(testResult);

  if (req.body.lastTestInLoop) {
    const deviceInfo = getDeviceInfoViaADB();
    if (deviceInfo) {
      setDeviceInfo(deviceInfo);
    }
    endSession();
  }

  pullTracesFile((err, tracePath) => {
    if (!err) {
      const hasAnr = checkANRFromFileAndSave(tracePath, "com.binogi", testName);
      if (hasAnr) {
        broadcastMessage(`❌ ANR Detected! Saved to logs/anr-traces/${testName}-<timestamp>.txt`);
      } else {
        broadcastMessage(`✅ Test finished with exit code ${code}`);
      }
    } else {
      broadcastMessage(`✅ Test finished with exit code ${code}`);
    }

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


// POST /test/start-session
router.post("/start-session", (req, res) => {
  const { sessionId } = req.body;
  startSession(sessionId);
  res.json({ success: true });
});

//download pdf
router.get("/history/:sessionId/pdf", async (req, res) => {
  const fileName = `${req.params.sessionId}.json`; 
  const jsonPath = path.join(__dirname, "../logs/reports", fileName);

  if (!fs.existsSync(jsonPath)) {
    console.log("❌ File not found:", jsonPath);
    return res.status(404).send("Session report not found");
  }

  const sessionData = JSON.parse(fs.readFileSync(jsonPath));
  const pdfPath = path.join(__dirname, "../temp", `${req.params.sessionId}.pdf`);

  await generatePDFReport(sessionData, pdfPath);

  res.download(pdfPath, (err) => {
    if (!err) {
      fs.unlink(pdfPath, () => {});
    }
  });
});



module.exports = router;
