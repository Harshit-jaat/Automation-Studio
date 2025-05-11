import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "../styles/testcases.module.css";
import Select from "react-select";

const backendUrl = "http://localhost:4000";


export default function TestCases() {
  const [testCases, setTestCases] = useState([]);
  const [selected, setSelected] = useState([]);
  const [logs, setLogs] = useState("");
  const [ws, setWs] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const wsBuffer = useRef([]);
  const stopped = useRef(false);

  useEffect(() => {
    axios.get(`${backendUrl}/api/testcases`).then((res) => {
      setTestCases(res.data.testCases);
    });

    const socket = new WebSocket(`ws://localhost:4000`);
    socket.onmessage = (e) => {
      setLogs((prev) => prev + "\n" + e.data);
      if (e.data.includes("✅ Test finished") || e.data.includes("⛔ Test stopped by user.")) {
        wsBuffer.current.push("done");
      }
    };

    socket.onerror = () => setLogs((prev) => prev + "\n❌ WebSocket error");
    socket.onclose = () => setLogs((prev) => prev + "\n🔌 WebSocket closed");
    setWs(socket);
    return () => socket.close();
  }, []);

  const runTests = async () => {
    if (selected.length === 0) return alert("Select at least 1 test");
    setLogs("");
    setIsRunning(true);
    stopped.current = false;

    for (const script of selected) {
      if (stopped.current) {
        setLogs((prev) => prev + "\n⛔ Test execution stopped by user.");
        break;
      }

      setLogs((prev) => prev + `\n▶ Starting test: ${script}`);
      wsBuffer.current = [];

      await axios.post(`${backendUrl}/test/start`, { script });
      await waitForTestEnd();
    }

    setIsRunning(false);
    setLogs((prev) => prev + "\n✅ All tests finished!");
  };

  const waitForTestEnd = () => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (wsBuffer.current.includes("done") || stopped.current) {
          clearInterval(interval);
          resolve();
        }
      }, 500);
    });
  };

  const stopTest = () => {
    axios.post(`${backendUrl}/test/stop`).then((res) => {
      setLogs((prev) => prev + "\n" + res.data.message);
    });
    stopped.current = true;
  };

  const clearLogs = () => {
    setLogs("");
  };

  const testCaseOptions = testCases.map(test => ({
    value: test.script,
    label: test.name
  }));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
      <Link to="/" className={styles.backButton}>⬅ Back to Home</Link>
        <h2 className={styles.heading}>🧪 Test Case Manager</h2>
      </div>

      <div className={styles.layout}>
        <div className={styles.selector}>
          <h3>Select Test Cases</h3>

          <Select
            isMulti
            options={testCaseOptions}
            value={testCaseOptions.filter(opt => selected.includes(opt.value))}
            onChange={(selectedOptions) => setSelected(selectedOptions.map(opt => opt.value))}
          />

          <div className={styles.buttons}>
            <button onClick={runTests} disabled={isRunning} className={styles.runBtn}>▶ Run Selected</button>
            <button onClick={stopTest} disabled={!isRunning} className={styles.stopBtn}>⛔ Stop Test</button>
          </div>
        </div>

        <div className={styles.logs}>
          <div className={styles.logsHeader}>
            📜 Live Logs
            <button onClick={clearLogs} className={styles.clearBtn}>🧹 Clear</button>
          </div>
          <pre className={styles.logsBox}>{logs}</pre>
        </div>
      </div>
    </div>
  );
}
