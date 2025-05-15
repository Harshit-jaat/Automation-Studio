const { app, protocol, BrowserWindow , dialog  } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const { URL } = require("url");
const fs = require("fs");
const mime = require("mime-types");
const axios = require("axios");
const logFile = path.join(app.getPath("userData"), "backend.log");
const { autoUpdater } = require("electron-updater");




let mainWindow;
let backendProcess = null;
let lastBackendError = null; 



function notifyStatus(msg) {
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send("backend-status", msg);
  }
}


async function waitForBackendReady(url, retries = 5, interval = 1000) {
  let lastError = null;

  for (let i = 0; i < retries; i++) {
    try {
      const res = await axios.get(url);
      if (res.status === 200) {
        console.log("✅ Backend is ready.");
        await dialog.showMessageBox({
          type: "info",
          title: "Backend Started",
          message: "✅ Backend server is up and running!",
        });
        return true;
      }
    } catch (err) {
      await dialog.showErrorBox(`sbdhbehdbhbh \n  ${err}`);
      lastError = err.message;
      console.warn(`⏳ Waiting for backend... [Attempt ${i + 1}/${retries}]`);
      console.warn(`Error: ${err.message}`);
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }

  dialog.showErrorBox("❌ Backend Error", `Backend failed to start.\nLast error: ${lastError}`);
  return false;
}




protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: {
      secure: true,
      standard: true,
      supportFetchAPI: true,
      corsEnabled: true,
    },
  },
]);

function getNodeBinaryPath() {
  const platform = process.platform;
  if (platform === "win32") return path.join(process.resourcesPath, "node", "win", "node.exe");
  if (platform === "darwin") return path.join(process.resourcesPath, "node", "mac", "bin", "node");
  return path.join(process.resourcesPath, "node", "linux", "bin", "node");
}

function createWindow() {
  return new Promise((resolve, reject) => {
    mainWindow = new BrowserWindow({
      width: 1400,
      height: 800,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    const isDev = !app.isPackaged;
    const loadURL = isDev ? "http://localhost:3000" : "app://index.html";

    mainWindow.loadURL(loadURL)
      .then(() => {
        mainWindow.webContents.openDevTools();
        console.log("✅ Main window loaded.");

        resolve(); 
      })
      .catch((err) => {
        console.error("❌ Failed to load window:", err);
        reject(err);
      });
      

    mainWindow.on("closed", () => {
      mainWindow = null;
      if (backendProcess && !backendProcess.killed) backendProcess.kill();
    });
  });
}


// async function startBackend() {
//   const backendScript = path.join(process.resourcesPath, "backend", "server.js");
//   const nodePath = path.join(process.resourcesPath, "node", "mac", "bin", "node");

//   if (!fs.existsSync(backendScript)) {
//     await dialog.showErrorBox("Missing backend", "server.js not found.");
//     return;
//   }

//   if (!fs.existsSync(nodePath)) {
//     await dialog.showErrorBox("Missing Node.js", "Node binary not found.");
//     return;
//   }

//   fs.appendFileSync(logFile, `[STARTING BACKEND] ${nodePath} ${backendScript}\n`);

// backendProcess = spawn(nodePath, [backendScript], {
//   cwd: path.dirname(backendScript),
//   stdio: 'inherit',
//   env: {
//     ...process.env,
//     PATH: `${path.dirname(nodePath)}:${process.env.PATH}`
//   }
// });

//   let backendReady = false;

//   backendProcess.on("exit", (code, signal) => {
//   let message = `❌ Backend exited early.\nCode: ${code}\nSignal: ${signal}`;
//   if (lastBackendError) {
//     message += `\n\nError: ${lastBackendError}`;
//   }
//   // dialog.showErrorBox("Backend Error", message);
// });

//   backendProcess.on("error", (err) => {
//   lastBackendError = err.message;
//   console.error(`❌ Failed to spawn backend: ${err.message}`);
//   dialog.showErrorBox("Spawn Error", err.message);
// });


//   const ready = await waitForBackendReady("http://localhost:4000/api/healthcheck");
//   if (ready) {
//     backendReady = true;
//     await dialog.showMessageBox({
//       type: "info",
//       title: "Backend Started",
//       message: "✅ Backend server is up and running!",
//     });
//   } else {
//     dialog.showErrorBox("Backend Error", `❌ Healthcheck failed. Check terminal logs.`);
//   }
// }

async function startBackend() {
  const backendScript = path.join(process.resourcesPath, "backend", "server.js");
  const nodePath = getNodeBinaryPath();

  if (!fs.existsSync(backendScript)) {
    await dialog.showErrorBox("Missing backend", "server.js not found.");
    return;
  }

  if (!fs.existsSync(nodePath)) {
    await dialog.showErrorBox("Missing Node.js", "Node binary not found.");
    return;
  }

  const startProcess = () => {
    fs.appendFileSync(logFile, `[STARTING BACKEND] ${nodePath} ${backendScript}\n`);

    backendProcess = spawn(nodePath, [backendScript], {
      cwd: path.dirname(backendScript),
      stdio: 'inherit',
      env: {
        ...process.env,
        PATH: `${path.dirname(nodePath)}:${process.env.PATH}`,
      }
    });

    backendProcess.on("exit", (code, signal) => {
      console.warn(`❌ Backend crashed. Code: ${code}, Signal: ${signal}`);
      lastBackendError = `Code: ${code}, Signal: ${signal}`;
      notifyStatus("Backend crashed. Restarting...");

      // Wait a bit and restart
      setTimeout(() => {
        startProcess();
      }, 2000);
    });

    backendProcess.on("error", (err) => {
      lastBackendError = err.message;
      console.error(`❌ Failed to spawn backend: ${err.message}`);
      dialog.showErrorBox("Spawn Error", err.message);
    });
  };

  startProcess();

  const ready = await waitForBackendReady("http://localhost:4000/api/healthcheck", 10, 1000);
  if (ready) {
    notifyStatus("✅ Backend started.");
  } else {
    notifyStatus("❌ Backend health check failed.");
  }
}





app.whenReady().then(async () => {
  protocol.handle("app", async (request) => {
    const parsedUrl = new URL(request.url);
    let pathname = parsedUrl.pathname;

    if (pathname.startsWith("/")) {
      pathname = pathname.slice(1);
    }

    if (!pathname) {
      pathname = "index.html";
    }

    const filePath = path.join(process.resourcesPath, "frontend", pathname);

    try {
      await fs.promises.access(filePath, fs.constants.R_OK);
      const mimeType = mime.lookup(filePath) || "text/plain";

      return new Response(fs.createReadStream(filePath), {
        headers: {
          "Content-Type": mimeType,
          "Cache-Control": "public, max-age=86400",
        },
      });
    } catch (err) {
      console.log("❗ File not found:", filePath);
      return new Response("File Not Found", { status: 404 });
    }
  }); 
  await createWindow();
  startBackend();

  autoUpdater.checkForUpdatesAndNotify();

  
}); 

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});

app.on("window-all-closed", () => {
  if (backendProcess && !backendProcess.killed) backendProcess.kill();
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (backendProcess && !backendProcess.killed) backendProcess.kill();
});


autoUpdater.on("update-available", () => {
  console.log("Downloading new update")
});

autoUpdater.on("download-progress", (progressObj) => {
  const log_message = `📥 Downloaded ${progressObj.percent.toFixed(2)}% ` +
                      `(${(progressObj.transferred / 1024 / 1024).toFixed(2)} MB / ` +
                      `${(progressObj.total / 1024 / 1024).toFixed(2)} MB) ` +
                      `- Speed: ${(progressObj.bytesPerSecond / 1024).toFixed(2)} KB/s`;

  console.log(log_message);

  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send("update-download-progress", progressObj);
  }
});


autoUpdater.on("update-downloaded", () => {
  dialog.showMessageBox({
    type: "info",
    title: "Update Ready",
    message: "Update downloaded. Restart now?",
    buttons: ["Restart", "Later"],
  }).then(result => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

autoUpdater.on("error", (err) => {
  console.error("❌ AutoUpdater Error:", err);
});
