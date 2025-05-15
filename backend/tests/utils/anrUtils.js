const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { spawnSync, execSync } = require("child_process");
const { getADBPath, getConnectedDevice } = require("../../config/devicesutils");

const TRACES_FILE = "/data/anr/traces.txt";
function collectLogcatErrors() {
  try {
    const adbPath = getADBPath();
    const deviceId = getConnectedDevice();
    if (!deviceId) throw new Error("No connected device");

    const result = spawnSync(adbPath, [
      "-s", deviceId,
      "logcat",
      "-d",
      "-b", "main",
      "-b", "crash",
      "-b", "system"
    ], {
      encoding: "utf-8"
    });

    if (result.error) throw result.error;

    const lines = result.stdout.split("\n");

    // Strict filter: only ' E ' lines
    const errorLines = lines.filter((line) =>
      line.includes(" E ") && line.includes("com.binogi")
    );

    return errorLines.join("\n") || "No error-level logs found for com.binogi.";

  } catch (err) {
    console.error("❌ Failed to collect logcat errors:", err.message);
    return `Logcat collection failed: ${err.message}`;
  }
}




function pullTracesFile(callback) {
  exec(`adb pull ${TRACES_FILE}`, (err, stdout, stderr) => {
    if (err) return callback(err);
    const pulledPath = path.resolve("traces.txt"); // pulled to project root
    callback(null, pulledPath);
  });
}

function checkANRFromFileAndSave(filePath, packageName, testName) {
  const content = fs.readFileSync(filePath, "utf-8");

  if (!content.includes(packageName)) {
    fs.unlinkSync(filePath); // delete the temp traces.txt if no ANR
    return false;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const saveDir = path.resolve(__dirname, "../../logs/anr-traces");
  const fileName = `${testName}-${timestamp}.txt`;
  const finalPath = path.join(saveDir, fileName);

  if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir, { recursive: true });
  fs.renameSync(filePath, finalPath);

  return true;
}

module.exports = {
  pullTracesFile,
  checkANRFromFileAndSave,
  collectLogcatErrors,

};
