import React from "react";
import { useNavigate } from "react-router-dom";

function UploadPage({ setReportData }) {
  const navigate = useNavigate();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    let formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://127.0.0.1:8000/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setReportData(data);
    navigate("/results");
  };

  return (
    <div className="upload-container">
      <h1 className="title">Health Report Analyzer</h1>
      <input
        type="file"
        accept=".csv,.xlsx"
        onChange={handleFileUpload}
        className="file-input"
      />
    </div>
  );
}

export default UploadPage;
