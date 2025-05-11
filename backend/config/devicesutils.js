const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const os = require("os");



const UPLOADS_DIR = path.join(__dirname, "../uploads");


function getADBPath() {
  const platform = os.platform();


  const basePath =
    process.resourcesPath && typeof process.resourcesPath === "string"
      ? process.resourcesPath
      : path.join(__dirname, "..");


  let adbPath;

  if (platform === "win32") {
    adbPath = path.join(basePath, "bin", "win", "platform-tools", "adb.exe");
  } else if (platform === "darwin") {
    adbPath = path.join(basePath, "bin", "mac", "platform-tools", "adb");
  } else if (platform === "linux") {
    adbPath = path.join(basePath, "bin", "linux", "platform-tools", "adb");
  } else {
    throw new Error("❌ Unsupported platform for ADB");
  }


  return adbPath;
}

function getLatestAPK() {


  const files = fs
    .readdirSync(UPLOADS_DIR)
    .filter((file) => {
      const isAPK = file.endsWith(".apk");

      return isAPK;
    })
    .map((file) => {
      const filePath = path.join(UPLOADS_DIR, file);
      const time = fs.statSync(filePath).mtime.getTime();
      return { file, time };
    })
    .sort((a, b) => b.time - a.time);

  if (files.length === 0) {

    return null;
  }

  const latest = path.join(UPLOADS_DIR, files[0].file);

  return latest;
}

function getConnectedDevice() {
  try {

    const adbPath = getADBPath();


    const output = execSync(`"${adbPath}" devices`).toString();


    const lines = output
      .split("\n")
      .filter((line) => line.includes("\tdevice"));

    console.log("🔎 Filtered device lines:", lines);

    if (lines.length === 0) throw new Error("❌ No Android device connected");

    const deviceId = lines[0].split("\t")[0];
    console.log("✅ Connected device ID:", deviceId);
    return deviceId;
  } catch (err) {
    console.error("❌ Failed to get connected device:", err.message);
    return null;
  }
}

module.exports = {
  getConnectedDevice,
  getLatestAPK,
};
