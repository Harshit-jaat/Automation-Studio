const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const os = require("os");

const UPLOADS_DIR = path.join(__dirname, "../uploads");


function getADBPath() {
  const platform = os.platform();
  const isDev = !process.resourcesPath || process.resourcesPath === process.cwd();
  const basePath = isDev ? __dirname : process.resourcesPath;

  if (platform === "win32") {
    return path.join(basePath, "bin/win/platform-tools/adb.exe");
  } else if (platform === "darwin") {
    return path.join(basePath, "bin/mac/platform-tools/adb");
  } else if (platform === "linux") {
    return path.join(basePath, "bin/linux/platform-tools/adb");
  } else {
    throw new Error("Unsupported platform for ADB");
  }
}


function getLatestAPK() {
  const files = fs
    .readdirSync(UPLOADS_DIR)
    .filter((file) => file.endsWith(".apk"))
    .map((file) => ({
      file,
      time: fs.statSync(path.join(UPLOADS_DIR, file)).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time);

  return files.length > 0 ? path.join(UPLOADS_DIR, files[0].file) : null;
}

function getConnectedDevice() {
  try {
    const adbPath = getADBPath();
    const output = execSync(`"${adbPath}" devices`).toString();
    const lines = output
      .split("\n")
      .filter((line) => line.includes("\tdevice"));

    if (lines.length === 0) throw new Error("No Android device connected");

    return lines[0].split("\t")[0];
  } catch (err) {
    console.error("❌ Failed to get connected device:", err.message);
    return null;
  }
}

module.exports = {
  getConnectedDevice,
  getLatestAPK,
};
