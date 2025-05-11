const WebSocket = require("ws");

let wss;
let testProcess = null;

function initWebSocket(server) {
  console.log("Initiating websocket");
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("✅ WebSocket Client Connected");
    ws.send("💡 Ready to receive test logs...");

    ws.on("message", (msg) => {
      if (msg === "stop") {
        stopCurrentTest("⛔ Test stop command received from frontend");
      }
    });

    ws.on("close", () => {
      console.log("❌ WebSocket Client Disconnected");
    });
  });
}

function broadcastMessage(message) {
  if (!wss) return;
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message.toString());
    }
  });
}

function setProcess(proc) {
  testProcess = proc;
}

function stopCurrentTest(reason = "⛔ Test stopped.") {
  if (testProcess) {
    console.log(reason);
    testProcess.kill("SIGTERM");
    broadcastMessage(reason);
    testProcess = null;
  }
}

module.exports = {
  initWebSocket,
  broadcastMessage,
  setProcess,
  stopCurrentTest,
};
