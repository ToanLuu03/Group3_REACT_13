import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const linesConfig = [
  { dataKey: "BA", stroke: "#00BFFF" },
  { dataKey: "C#", stroke: "#333333" },
  { dataKey: ".NET", stroke: "#FF6347" },
  { dataKey: "AI", stroke: "#CCCCCC" },
];

const statusLines = [
  { dataKey: "Active", stroke: "#00BFFF" },
  { dataKey: "DropOut", stroke: "#333333" },
  { dataKey: "Enrolled", stroke: "#FF6347" },
  { dataKey: "Rejected", stroke: "#CCCCCC" },
];

const TraineeLineChart = ({ technical, data }) => {
  const [visibleLines, setVisibleLines] = useState([]);
  const [filteredConfig, setFilteredConfig] = useState([]);

  useEffect(() => {
    const keysInData = data.reduce((acc, entry) => {
      Object.keys(entry).forEach((key) => {
        if (key !== "month" && !acc.includes(key)) acc.push(key);
      });
      return acc;
    }, []);

    const relevantConfig = (technical ? linesConfig : statusLines).filter(
      ({ dataKey }) => keysInData.includes(dataKey)
    );

    setFilteredConfig(relevantConfig);
    setVisibleLines(relevantConfig.map(({ dataKey }) => dataKey));
  }, [data, technical]);

  const isEmptyData = data.length === 0 || filteredConfig.length === 0;

  return (
    <div style={{ width: "100%", height: 300 }}>
      {isEmptyData ? (
        <div className="flex items-center text-3xl italic text-slate-500 justify-center h-full">
          <p>No Data Available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              padding={{ left: 20, right: 20 }}
              interval={0}
            />
            <YAxis
              ticks={[0, 20, 40, 60, 80, 100, 120]}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip />
            <Legend />
            {filteredConfig
              .filter(({ dataKey }) => visibleLines.includes(dataKey))
              .map(({ dataKey, stroke }, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={dataKey}
                  stroke={stroke}
                  strokeWidth={5}
                  dot={false}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TraineeLineChart;
