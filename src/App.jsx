import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import ResultsPage from "./pages/ResultsPage";
import "./index.css";

export default function App() {
  const [reportData, setReportData] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage setReportData={setReportData} />} />
        <Route path="/results" element={<ResultsPage reportData={reportData} />} />
      </Routes>
    </Router>
  );
}
