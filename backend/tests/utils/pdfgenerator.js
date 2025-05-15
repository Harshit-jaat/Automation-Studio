const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function generatePDFReport(sessionData, outputPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(outputPath);

    doc.pipe(stream);

    // Title
    doc.fontSize(20).text("📋 Test Session Report", { align: "center" });
    doc.moveDown();

    // Session Info
    doc.fontSize(12).text(`🆔 Session ID: ${sessionData.sessionId}`);
    doc.text(`🕒 Start Time: ${new Date(sessionData.startTime).toLocaleString()}`);
    doc.text(`⏱️ Duration: ${sessionData.duration}`);
    doc.text(`📱 Device: ${sessionData.deviceInfo?.brand} ${sessionData.deviceInfo?.model}`);
    doc.text(`🧠 Android: ${sessionData.deviceInfo?.platformVersion} (API ${sessionData.deviceInfo?.apiVersion})`);
    doc.moveDown();

    // Test Results
    doc.fontSize(14).text("🧪 Test Results", { underline: true });
    doc.moveDown(0.5);

    sessionData.testResults.forEach((test, index) => {
      doc.fontSize(12).text(`${index + 1}. ${test.testName} (${test.status.toUpperCase()})`, { bold: true });
      doc.moveDown(0.25);

      if (test.logs) {
        doc.font("Courier").fontSize(10).text("Logs:", { continued: false });
        doc.font("Courier").text(test.logs.slice(0, 1000) || "None", { indent: 20 });
      }

      if (test.logcatErrors) {
        doc.font("Courier").fontSize(10).text("Logcat Errors:", { continued: false });
        doc.font("Courier").text(test.logcatErrors.slice(0, 2000) || "None", { indent: 20 });
      }

      doc.moveDown();
    });

    doc.end();

    stream.on("finish", () => resolve(outputPath));
    stream.on("error", reject);
  });
}

module.exports = { generatePDFReport };
