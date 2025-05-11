const fs = require("fs");
const path = require("path");


const UPLOADS_DIR = path.join(__dirname, "../../uploads");
const { execSync } = require("child_process");

const { remote } = require("webdriverio");
const appiumConfig = require("../../config/appium.config"); 

let driver = null;







/**
 * Logs messages with timestamps.
 * @param {string} message - The message to log.
 */
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

async function initDriver() {
  if (!driver) {
    driver = await remote({
      ...appiumConfig.server,
      capabilities: {
        alwaysMatch: appiumConfig.capabilities,
        firstMatch: [{}],
      },
    });
  }
  return driver;
}

function getDriver() {
  if (!driver) {
    throw new Error("❗Driver not initialized. Please call initDriver() first.");
  }
  return driver;
}

async function quitDriver() {
  if (driver) {
    await driver.deleteSession();
    driver = null;
  }
}



module.exports = {
  log,
  initDriver,
  getDriver,
  quitDriver,
};
