const path = require("path");
const { spawn } = require("child_process");

let appiumProcess = null;

function startAppium() {
  if (appiumProcess) {
    console.log("⚠️ Appium is already running.");
    return;
  }

  const appiumPath = path.join(__dirname, "../node_modules/appium/build/lib/main.js");
  appiumProcess = spawn("node", [appiumPath, "--port", "4723"]);

  appiumProcess.stdout.on("data", (data) => {
    console.log(`[Appium] ${data}`);
  });

  appiumProcess.stderr.on("data", (data) => {
    console.error(`[Appium Error] ${data}`);
  });

  appiumProcess.on("exit", () => {
    console.log("❌ Appium stopped");
    appiumProcess = null;
  });

  console.log("🚀 Appium started on port 4723");
}

function stopAppium() {
  if (appiumProcess) {
    appiumProcess.kill();
    appiumProcess = null;
    console.log("⛔ Appium stopped");
  }
}

module.exports = {
  startAppium,
  stopAppium,
};
