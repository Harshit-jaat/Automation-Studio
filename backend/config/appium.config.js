const path = require("path");
const { getLatestAPK, getConnectedDevice } = require("./devicesutils");

const deviceId = getConnectedDevice();
const latestAPK = getLatestAPK();

if (!deviceId) {
  throw new Error("❌ No connected Android device found. Please connect one before running tests.");
}

if (!latestAPK) {
  throw new Error("❌ No APK found in /uploads. Please upload an APK before running tests.");
}

module.exports = {
  server: {
    hostname: "localhost",
    port: 4723,
    path: "/",
  },
  capabilities: {
    platformName: "Android",
    "appium:deviceName": deviceId,
    "appium:udid": deviceId,
    "appium:app": latestAPK,
    "appium:automationName": "UiAutomator2",
    "appium:noReset": false,
    "appium:fullReset": false,
    "appium:newCommandTimeout": 300,
    "appium:androidInstallTimeout": 300000,
    "appium:autoGrantPermissions": true,
  },
};


//for inspector capabilities
// {
//     "platformName": "Android",
//     "deviceName": "TRJDU19404007242",  
//     "automationName": "UiAutomator2",
//     "noReset": true
//   }