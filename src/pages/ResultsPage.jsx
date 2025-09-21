import React from "react";
import ChartComponent from "../components/ChartComponent";

function ResultsPage({ reportData }) {
  if (!reportData || reportData.length === 0) {
    return (
      <div className="results-empty">
        <h2>No report uploaded yet.</h2>
      </div>
    );
  }

  return (
    <div className="results-container">
      <h1 className="results-title">Report Analysis Results</h1>
      <div className="results-grid">
        {/* Table */}
        <div className="table-container">
          <h2 className="section-title">Biomarkers</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Biomarker</th>
                <th>Value</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.biomarker}</td>
                  <td>{item.value}</td>
                  <td className={`status ${item.status.toLowerCase()}`}>
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chart */}
        <div className="chart-container">
          <h2 className="section-title">Biomarker Values</h2>
          <ChartComponent data={reportData} />
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;
