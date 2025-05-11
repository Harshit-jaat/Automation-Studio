import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "../styles/translations.module.css";

const backendUrl = "http://localhost:4000";

export default function Translations() {
  const [text, setText] = useState("");
  const [results, setResults] = useState([]);

  const findTranslations = async () => {
    if (!text.trim()) return;
    const res = await axios.post(`${backendUrl}/api/translate`, { text });
    setResults(res.data.translations || []);
  };

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backButton}>⬅ Back to Home</Link>

      <h2 className={styles.title}>🌍 Translation Finder</h2>

      <div className={styles.inputSection}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter English Text..."
          className={styles.input}
        />
        <button onClick={findTranslations} className={styles.button}>Find Translations</button>
      </div>

      {results.length === 0 && text && (
        <h3>No matching translations found for "{text}"</h3>
      )}

      {results.map((item, idx) => (
        <div key={idx} className={styles.resultBlock}>
          <h3>Result {idx + 1}: {item.key}</h3>
          <div className={styles.resultContent}>
            
            <div className={styles.tableSection}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Language</th>
                    <th>Translation</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(item.translations).map(([lang, trans]) => (
                    <tr key={lang}>
                      <td className={styles.td}>{lang}</td>
                      <td className={styles.td}>{trans || <span className={styles.notFound}>❌ Not found</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.jsonSection}>
              <h4>JSON Format</h4>
              <pre className={styles.jsonView}>
                {JSON.stringify(item.translations, null, 2)}
              </pre>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}
