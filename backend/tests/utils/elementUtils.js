const DEFAULT_TIMEOUT = 5000;
const RETRY_ATTEMPTS = 6;
const RETRY_DELAY = 2000;
const fs = require("fs");
const path = require("path");

const { broadcastMessage } = require("../../websocket/wsServer");
const appiumConfig = require(
    path.resolve(__dirname, "../../config/appium.config.js"),
  );

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retryAction(
  actionFn,
  {
    retries = RETRY_ATTEMPTS,
    delay = RETRY_DELAY,
    label = "",
    fastRetries = 3, // how many fast (no-delay) attempts first
  } = {},
) {
  let attempt = 0;

  while (attempt < retries) {
    try {
      const result = await actionFn();
      return result;
    } catch (err) {
      attempt++;
      console.warn(`⚠️ ${label || "Action"} failed (attempt ${attempt}): ${err.message}`);

      if (attempt < retries) {
        if (attempt >= fastRetries) {
          await wait(delay); // use delay only after fast retries are exhausted
        }
      } else {
        console.error(`❌ ${label || "Action"} failed after ${retries} attempts`);
        throw err;
      }
    }
  }
}

async function scrollInElement(driver, element, direction = 'down', scrollAmount = 300) {
  const { x, y, width, height } = await element.getRect();

  let startX, startY, endX, endY;
  switch (direction) {
    case 'down':
      startX = x + width / 2;
      startY = y + height * 0.8;
      endX = startX;
      endY = startY - scrollAmount;
      break;
    case 'up':
      startX = x + width / 2;
      startY = y + height * 0.2;
      endX = startX;
      endY = startY + scrollAmount;
      break;
    default:
      throw new Error(`Unsupported direction: ${direction}`);
  }

  await driver.touchPerform([
    { action: 'press', options: { x: startX, y: startY } },
    { action: 'wait', options: { ms: 500 } },
    { action: 'moveTo', options: { x: endX, y: endY } },
    { action: 'release' }
  ]);

  await driver.pause(1000);
}




// 🧠 Retry-enabled element fetch with display check
async function waitForElement(driver, selector, timeout = DEFAULT_TIMEOUT) {
  return await retryAction(
    async () => {
      const element = await driver.$(selector);
      await element.waitForDisplayed({ timeout });
      return element;
    },
    {
      label: `Wait for element ${selector}`,
    },
  );
}

async function clickFirstAvailableElement(driver, selectorArray, label = 'Element') {
  for (const selector of selectorArray) {
    try {
      const el = await waitForElement(driver, selector.path, 3000); // try each one fast
      if (await el.isExisting()) {
        await el.click();
        console.log(`✅ Clicked ${label}`);
        return;
      }
    } catch (_) {
      // Skip if not found
    }
  }
  throw new Error(`❌ None of the selectors for "${label}" were found.`);
}


// 🔁 Retry-enabled click
async function clickElement(driver, selector) {
  return await retryAction(
    async () => {
      const el = await waitForElement(driver, selector);
      await el.click();
    },
    {
      label: `Click ${selector}`,
      retries: 6,
    },
  );
}

async function enterText(driver, selector, text, label = null) {
  return await retryAction(
    async () => {
      const el = await waitForElement(driver, selector);
      await el.setValue(text);
    },
    {
      label: label ? `Enter: ${label}` : `Enter text into ${selector}`,
    },
  );
}

async function getText(driver, selector, label = null) {
  return await retryAction(
    async () => {
      const el = await waitForElement(driver, selector);
      return await el.getText();
    },
    {
      label: label ? `Get: ${label}` : `Get text from ${selector}`,
    },
  );
}

// utils/errorUtils.js
function handleTestError(error, testName = "Unknown Test") {
  const msg = error.message || "Unknown error";
  const trace = error.stack || "No stack trace available";

  let friendly = "💥 Unexpected error occurred.";
  if (msg.includes("NoSuchElement")) {
    friendly = "❗ UI Element not found.";
  } else if (msg.includes("timeout")) {
    friendly = "⏳ Timeout while waiting for element.";
  }

  broadcastMessage(
    [
      `🚨 ${testName} Failed`,
      `🧾 Message: ${friendly}`,
      `🧠 Raw Error: ${msg}`,
      `📄 Stack Trace:\n${trace}`,
    ].join("\n"),
  );
}


async function restartDriver(driverRef) {
    await driverRef.deleteSession();
    return await remote({
      ...appiumConfig.server,
      capabilities: appiumConfig.capabilities,
    });
  }

module.exports = {
  waitForElement,
  clickElement,
  enterText,
  getText,
  retryAction,
  handleTestError,
  restartDriver,
  clickFirstAvailableElement,
  scrollInElement,
};
