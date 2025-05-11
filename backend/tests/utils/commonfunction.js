const { click } = require("./mainfunction");
const { getDriver } = require("./helpers"); 
const intro = require("../binogi/elements/onboarding/intro"); 

async function clickContinue(options = {delay : 500}) {
  const text = intro.continue?.en || "Continue";
  await click(text, options);
}

async function clickBack({ print = false, delay = 0 } = {}) {
  const driver = getDriver();

  if (delay > 0) {
    await driver.pause(delay);
  }

  // Step 1: Try clicking by className
  try {
    const el = await driver.$('android=new UiSelector().className("com.horcrux.svg.CircleView")');
    if (await el.isDisplayed()) {
      await el.click();
      if (print) console.log("✅ Clicked back button using className");
      return;
    }
  } catch (err) {
    if (print) console.warn("⚠️ Back button not clickable via className, falling back to coordinates");
  }

  // Step 2: Fallback - tap using bounds center
  const fallbackX = 109;
  const fallbackY = 169;
  await driver.touchPerform([
    { action: "press", options: { x: fallbackX, y: fallbackY } },
    { action: "release" }
  ]);

  if (print) console.log(`✅ Tapped back button at fallback coordinates (${fallbackX}, ${fallbackY})`);
}


module.exports = {
  clickContinue,
  clickBack
}
