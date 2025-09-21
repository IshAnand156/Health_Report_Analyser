import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function ChartComponent({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="biomarker" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#3182ce" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default ChartComponent;
