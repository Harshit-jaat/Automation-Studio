const express = require("express");
const {
  getConnectedDevice,
} = require("../config/devicesutils");
const fs = require("fs");
const path = require("path");

const router = express.Router();


router.post('/get-devices', async (req, res) => {
  try {
    const device = await getConnectedDevice(); // Ensure it's async if necessary
    if (!device) {
      return res.status(204).json({ message: "No device connected" });
    }

    return res.status(200).json({ device });
  } catch (error) {
    console.error("Error getting device:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post('/add', (req, res) => {
  const filePath = path.join(__dirname, '../data/devices.json');
  const newEntry = req.body.newEntry;
  console.log(newEntry);

  

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Read failed' });

    let json = [];
    try {
      json = JSON.parse(data);
    } catch (e) {
      return res.status(500).json({ error: 'Invalid JSON format' });
    }
if (!newEntry || !newEntry.name || !newEntry.ID) {
  return res.status(400).json({ error: 'Missing name or ID' });
}
    const alreadyExists = json.some(item => item.ID === newEntry.ID);
if (alreadyExists) {
  return res.status(409).json({ error: 'Device already exists' });
}


    json.push(newEntry);

    fs.writeFile(filePath, JSON.stringify(json, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Write failed' });
      res.status(200).json({ message: 'Added successfully' });
    });
  });
});

module.exports = router;
