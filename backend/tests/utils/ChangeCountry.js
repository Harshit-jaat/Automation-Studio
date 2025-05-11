const { getDriver } = require("./helpers");

async function disablePlayStore() {
    const driver = getDriver();
    try {
      const result = await driver.execute('mobile: shell', {
        command: 'pm',
        args: ['disable-user', 'com.android.vending'],
      });
      console.log("✅ Play Store disable result:", result);
    } catch (err) {
      console.error("❌ Failed to disable Play Store via shell:", err.message);
    }
  }
  

async function enablePlayStore() {
  const driver = getDriver();
  await driver.execute('mobile: shell', {
    command: 'pm',
    args: ['enable', 'com.android.vending'],
  });
  console.log("✅ Play Store re-enabled");
}

async function launchApp(packageName = "com.binogi") {
  const driver = getDriver();
  await driver.execute('mobile: shell', {
    command: 'monkey',
    args: ['-p', packageName, '-c', 'android.intent.category.LAUNCHER', '1'],
  });
  console.log(`🚀 Launched app: ${packageName}`);
}

async function connectToVPN(countryName) {
  // You can replace this with actual interaction if your VPN app has a UI or intent-based trigger
  console.log(`🌍 Please manually connect VPN to ${countryName} or automate via VPN app UI`);
  await new Promise((resolve) => setTimeout(resolve, 5000)); // wait for 5 sec
}

async function forceCountryByIP(countryName, packageName = "com.binogi") {
  const driver = getDriver();

  await disablePlayStore();
  await connectToVPN(countryName);
  await launchApp(packageName);
}

module.exports = { 
    disablePlayStore,
    enablePlayStore
}
