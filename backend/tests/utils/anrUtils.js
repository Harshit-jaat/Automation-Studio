const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const TRACES_FILE = "/data/anr/traces.txt";

function pullTracesFile(callback) {
  exec(`adb pull ${TRACES_FILE}`, (err, stdout, stderr) => {
    if (err) return callback(err);
    const pulledPath = path.resolve("traces.txt"); // pulled to project root
    callback(null, pulledPath);
  });
}

function checkANRFromFileAndSave(filePath, packageName, testName) {
  const content = fs.readFileSync(filePath, "utf-8");

  if (!content.includes(packageName)) {
    fs.unlinkSync(filePath); // delete the temp traces.txt if no ANR
    return false;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const saveDir = path.resolve(__dirname, "../../logs/anr-traces");
  const fileName = `${testName}-${timestamp}.txt`;
  const finalPath = path.join(saveDir, fileName);

  if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir, { recursive: true });
  fs.renameSync(filePath, finalPath);

  return true;
}

module.exports = {
  pullTracesFile,
  checkANRFromFileAndSave,
};
