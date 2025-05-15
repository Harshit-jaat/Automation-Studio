const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const os = require("os");

const isProduction = process.env.NODE_ENV === "production";


const UPLOADS_DIR = isProduction
  ? path.join(process.resourcesPath, "uploads")
  : path.join(__dirname, "../uploads");

function getADBPath() {
  console.log("iiiiiiiiii",isProduction);
  const platform = os.platform();

  const basePath = isProduction
    ? process.resourcesPath
    : path.join(__dirname, "../../electron");

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
  if (!fs.existsSync(UPLOADS_DIR)) {
    console.error("❌ Uploads directory not found:", UPLOADS_DIR);
    return null;
  }

  const files = fs
    .readdirSync(UPLOADS_DIR)
    .filter((file) => file.endsWith(".apk"))
    .map((file) => {
      const filePath = path.join(UPLOADS_DIR, file);
      const time = fs.statSync(filePath).mtime.getTime();
      return { file, time };
    })
    .sort((a, b) => b.time - a.time);

  if (files.length === 0) {
    console.warn("⚠️ No APK files found in uploads directory");
    return null;
  }

  const latest = path.join(UPLOADS_DIR, files[0].file);
  return latest;
}

function getConnectedDevice() {
  try {
    const adbPath = getADBPath();
    const output = execSync(`"${adbPath}" devices`).toString();
    const lines = output.split("\n").filter((line) => line.includes("\tdevice"));

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

function getDeviceInfoViaADB() {
  try {
    const adbPath = getADBPath();
    const deviceId = getConnectedDevice();
    if (!deviceId) throw new Error("No device connected");

    const props = execSync(`"${adbPath}" -s ${deviceId} shell getprop`).toString();
    
    const parseProp = (key) => {
      const line = props.split("\n").find(line => line.includes(`[${key}]`));
      return line ? line.split("]: [")[1]?.replace("]", "") : null;
    };

    return {
      brand: parseProp("ro.product.brand"),
      model: parseProp("ro.product.model"),
      androidId: execSync(`"${adbPath}" -s ${deviceId} shell settings get secure android_id`).toString().trim(),
      platformVersion: parseProp("ro.build.version.release"),
      apiVersion: parseProp("ro.build.version.sdk"),
      locale: parseProp("persist.sys.locale") || parseProp("ro.product.locale"),
      displayDensity: parseInt(execSync(`"${adbPath}" -s ${deviceId} shell wm density`).toString().match(/\d+/)?.[0]),
      screenSize: execSync(`"${adbPath}" -s ${deviceId} shell wm size`).toString().trim().split(": ")[1],
      timeZone: execSync(`"${adbPath}" -s ${deviceId} shell getprop persist.sys.timezone`).toString().trim(),
    };
  } catch (err) {
    console.error("❌ Failed to fetch device info via ADB:", err.message);
    return null;
  }
}


module.exports = {
  getConnectedDevice,
  getLatestAPK,
  getDeviceInfoViaADB,
  getADBPath,
  
  
};
