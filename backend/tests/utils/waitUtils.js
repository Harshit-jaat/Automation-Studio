/**
 * Waits for a given amount of time.
 * @param {number} milliseconds - Time to wait.
 */
async function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

/**
 * Wait until an element contains a specific text.
 * @param {WebdriverIO.Browser} driver - The WebDriverIO browser instance.
 * @param {string} selector - The element selector.
 * @param {string} expectedText - The text to wait for.
 * @param {number} timeout - Max time to wait (default: 5000ms).
 */
async function waitForText(driver, selector, expectedText, timeout = 5000) {
  const element = await driver.$(selector);
  await element.waitUntil(
    async () => (await element.getText()) === expectedText,
    {
      timeout,
      timeoutMsg: `Expected text "${expectedText}" not found in ${timeout}ms`,
    },
  );
}

module.exports = {
  wait,
  waitForText,
};
