const { spawn, exec } = require("child_process");
const { broadcastMessage } = require("../../websocket/wsServer");

function readExperimentVariantFromLog(timeoutMs = 10000) {
  console.log("🔥 readExperimentVariantFromLog() called");
  return new Promise((resolve, reject) => {
    const logcat = spawn("adb", ["logcat", "*:S", "ReactNativeJS:V"]);
    broadcastMessage("🔍 Listening to logcat for experiment variant...");

    const timeout = setTimeout(() => {
      logcat.kill();
      broadcastMessage("⏰ Timed out waiting for experiment log.");
      reject(new Error("Timeout while waiting for experiment log"));
    }, timeoutMs);

    logcat.stdout.on("data", (data) => {
      const lines = data.toString().split("\n");
      lines.forEach((line) => {
        if (line.includes("roleeeeeee")) {
          broadcastMessage(`🧪 Raw Log Found: ${line}`);
          const match = line.match(/'roleeeeeee', '(\w+)'/);
          console.log("aaaa", match);
          if (match) {
            clearTimeout(timeout);
            logcat.kill();
            broadcastMessage(`🧪 Variant detected: ${match[1].toLowerCase()}`);
            resolve(match[1].toLowerCase()); // a or b
          }
        }
      });
    });

    logcat.stderr.on("data", (err) => {
      clearTimeout(timeout);
      logcat.kill();
      reject(new Error(`logcat error: ${err}`));
    });
  });
}
// function readExperimentVariantFromLog(timeoutMs = 10000) {
//     return new Promise((resolve, reject) => {
//         // Clear the existing log buffer to capture only new logs
//         exec("adb logcat -c", (err) => {
//             if (err) {
//                 return reject(new Error("❌ Failed to clear logcat buffer"));
//             }

//             broadcastMessage("🧹 Cleared old logcat buffer");
//             broadcastMessage("🔍 Listening for 'roleeeeeee' experiment variant...");

//             const logcat = spawn("adb", ["logcat", "*:S", "ReactNativeJS:V"]);

//             const timeout = setTimeout(() => {
//                 logcat.kill();
//                 broadcastMessage("⏰ Timed out waiting for experiment variant");
//                 reject(new Error("Timeout while waiting for experiment variant"));
//             }, timeoutMs);

//             logcat.stdout.on("data", (data) => {
//                 const lines = data.toString().split("\n");

//                 lines.forEach((line) => {
//                     if (line.includes("roleeeeeee")) {
//                         broadcastMessage(`🧪 Raw Log: ${line.trim()}`);

//                         // Match: 'roleeeeeee', 'A'  OR  'roleeeeeee', 'Base'
//                         const match = line.match(/'roleeeeeee',\s*'(\w+)'/i);
//                         if (match) {
//                             const variant = match[1].toLowerCase();
//                             clearTimeout(timeout);
//                             logcat.kill();

//                             broadcastMessage(`🧪 Variant Detected: ${variant}`);
//                             resolve(variant); // 'a', 'b', 'base'
//                         }
//                     }
//                 });
//             });

//             logcat.stderr.on("data", (err) => {
//                 clearTimeout(timeout);
//                 logcat.kill();
//                 reject(new Error(`logcat error: ${err}`));
//             });
//         });
//     });
// }
function streamGrowthExperimentLogs() {
  const logcat = spawn("adb", ["logcat", "*:S", "ReactNative:V"]);

  logcat.stdout.on("data", (data) => {
    const line = data.toString();
    if (line.includes("Experiment aa-test=")) {
      broadcastMessage(`🧪 ${line.trim()}`);
    }
  });

  logcat.stderr.on("data", (err) => {
    broadcastMessage(`❌ Logcat Error: ${err.toString()}`);
  });

  logcat.on("close", () => {
    // broadcastMessage("📴 Stopped streaming experiment logs");
  });

  return logcat; // return the process so you can stop it if needed
}

module.exports = {
  readExperimentVariantFromLog,
  streamGrowthExperimentLogs,
};
