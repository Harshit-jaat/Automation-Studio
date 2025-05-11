const { getDriver } = require("./helpers"); 

async function click(textObjectOrString, { language = "en", delay = 100, print = false } = {}) {
  const driver = getDriver();

  // Step 1: Resolve text based on object or string
  let finalText;
  if (typeof textObjectOrString === "object" && textObjectOrString !== null) {
    finalText = textObjectOrString[language] || textObjectOrString["en"];
  } else {
    finalText = textObjectOrString;
  }

  if (!finalText) {
    console.error(`❌ No text available for language "${language}"`);
    throw new Error(`No text found for click.`);
  }

  if (delay > 0) {
    await driver.pause(delay);
  }

  const tiers = [
    { retries: 5, delay: 0 },
    { retries: 5, delay: 500 },
    { retries: 5, delay: 1000 },
    { retries: 2, delay: 5000 },
  ];

  for (const tier of tiers) {
    for (let i = 0; i < tier.retries; i++) {
      try {
        const el = await driver.$(`android=new UiSelector().text("${finalText}")`);
        if (await el.isDisplayed()) {
          await el.click();
          if (print) console.log(`✅ Clicked element with exact text "${finalText}"`);
          return;
        }
      } catch {}

      try {
        const el = await driver.$(`android=new UiSelector().textContains("${finalText}")`);
        if (await el.isDisplayed()) {
          await el.click();
          if (print) console.log(`✅ Clicked element containing text "${finalText}"`);
          return;
        }
      } catch {}

      if (tier.delay > 0) await driver.pause(tier.delay);
    }
  }

  console.error(`❌ Element with text "${finalText}" not found or not clickable after all retries`);
  throw new Error(`Element with text "${finalText}" not found.`);
}

// --- Shortcuts ---

click.lg = function (textObjectOrString, language) {
  return click(textObjectOrString, { language });
};

click.delay = function (textObjectOrString, delay) {
  return click(textObjectOrString, { delay });
};

click.print = function (textObjectOrString) {
  return click(textObjectOrString, { print: true });
};

click.full = function (textObjectOrString, { language = "en", delay = 0, print = true } = {}) {
  return click(textObjectOrString, { language, delay, print });
};


async function typeInInput(textObjectOrString, valueToType, { language = "en", delay = 0, print = false } = {}) {
  const driver = getDriver();

  // Step 1: Resolve text based on object or string
  let finalText;
  if (typeof textObjectOrString === "object" && textObjectOrString !== null) {
    finalText = textObjectOrString[language] || textObjectOrString["en"];
  } else {
    finalText = textObjectOrString;
  }

  if (!finalText) {
    console.error(`❌ No text available for language "${language}"`);
    throw new Error(`No text found for typing.`);
  }

  if (delay > 0) {
    await driver.pause(delay);
  }

  const tiers = [
    { retries: 5, delay: 0 },
    { retries: 5, delay: 500 },
    { retries: 5, delay: 1000 },
    { retries: 2, delay: 5000 },
  ];

  for (const tier of tiers) {
    for (let i = 0; i < tier.retries; i++) {
      try {
        const el = await driver.$(`android=new UiSelector().text("${finalText}")`);
        if (await el.isDisplayed()) {
          await el.click(); // ✅ Step 1: Click to open keyboard
          await el.setValue(valueToType); // ✅ Step 2: Type
          await driver.pressKeyCode(66); // ✅ Step 3: Press Enter (KeyEvent.KEYCODE_ENTER)
          if (print) console.log(`✅ Typed "${valueToType}" into "${finalText}" and pressed Enter`);
          return;
        }
      } catch {}

      try {
        const el = await driver.$(`android=new UiSelector().textContains("${finalText}")`);
        if (await el.isDisplayed()) {
          await el.click(); // ✅ Click first
          await el.setValue(valueToType); // ✅ Type
          await driver.pressKeyCode(66); // ✅ Press Enter
          if (print) console.log(`✅ Typed "${valueToType}" into partial match "${finalText}" and pressed Enter`);
          return;
        }
      } catch {}

      if (tier.delay > 0) await driver.pause(tier.delay);
    }
  }

  console.error(`❌ Input with text "${finalText}" not found or not ready for typing after all retries`);
  throw new Error(`Input with text "${finalText}" not found.`);
}


module.exports = {
  click,
  typeInInput,
};