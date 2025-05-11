import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import TestCases from "./components/Testcases";
import Translations from "./components/Translations";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/testcases" element={<TestCases />} />
        <Route path="/translations" element={<Translations />} />
      </Routes>
    </Router>
  );
}

export default App;
