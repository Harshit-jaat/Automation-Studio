let session = null;

const generateReadableSessionId = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());

  let hours = now.getHours();
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  const formattedTime = `${pad(hours)}:${minutes}:${seconds} ${ampm}`;
  return `session-${year}/${month}/${day} ${formattedTime}`;
};

function startSession(id) {
  session = {
    sessionId: id,
    startTime: new Date().toISOString(),
    deviceInfo: null,
    testResults: []

  };
}

function addTestResult(result) {
  if (session) session.testResults.push(result);
}

function setDeviceInfo(info) {
  if (session) session.deviceInfo = info;
}

function endSession() {
  if (!session) return;

  session.endTime = new Date().toISOString();
  session.duration = (new Date(session.endTime) - new Date(session.startTime)) / 1000 + "s";

  const fileName = generateReadableSessionId();

  const fs = require("fs");
  const path = require("path");
  const file = path.join(__dirname, `../logs/reports/${session.sessionId}.json`);
  fs.writeFileSync(file, JSON.stringify(session, null, 2));

  session = null;
}

module.exports = { startSession, addTestResult, setDeviceInfo, endSession };
