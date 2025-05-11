const express = require("express");
const router = express.Router();
const path = require("path");
const oneSkyData = require(path.join(__dirname, "../strings/binogi/OneSky.json")); 

function findTranslations(textToFind) {
  const resultArray = []; // collect multiple matches

  const enTranslations = oneSkyData["en"]?.translation;
  if (!enTranslations) {
    throw new Error("English translations not found.");
  }

  const normalizedTextToFind = textToFind.trim().toLowerCase();
  const matchedKeys = [];


  function findKeys(obj, parentKey = "") {
    for (const key in obj) {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof obj[key] === "object") {
        findKeys(obj[key], fullKey);
      } else {
        const value = (obj[key] || "").trim().toLowerCase();
        if (value.includes(normalizedTextToFind)) {
          matchedKeys.push(fullKey);
        }
      }
    }
  }

  findKeys(enTranslations);

  if (matchedKeys.length === 0) {
    throw new Error(`❌ No matching keys found in English for text: "${textToFind}"`);
  }


  for (const key of matchedKeys) {
    const result = {};

    for (const lang of Object.keys(oneSkyData)) {
      const translations = oneSkyData[lang]?.translation;
      if (!translations) {
        result[lang] = null;
        continue;
      }

      const value = getValueByPath(translations, key);
      result[lang] = value || null;
    }

    resultArray.push({ key, translations: result });
  }

  return resultArray; 
}

  

function getValueByPath(obj, path) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }
  


  router.post("/translate", (req, res) => {
    const query = req.body.text;
    let translations = null;
  
    if (!query) {
      return res.status(400).json({ success: false, message: "No text provided." });
    }
  
    try {
      translations = findTranslations(query);
      res.json({ success: true, translations });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  });
  
  

module.exports = router;