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

const COLORS = [
  "#00BFFF",
  "#333333",
  "#B0E0E6",
  "#A9A9A9",
  "#FFD700",
  "#FF6347",
  "#4682B4",
  "#32CD32",
  "#FF69B4",
  "#8A2BE2",
  "#FF4500",
  "#2E8B57",
  "#DAA520",
  "#5F9EA0",
  "#FF1493",
  "#7B68EE",
  "#48D1CC",
  "#6A5ACD",
  "#40E0D0",
  "#DC143C",
];

const statusLines = [
  { dataKey: "Active" },
  { dataKey: "DropOut" },
  { dataKey: "Enrolled" },
  { dataKey: "Rejected" },
];

const generateTicks = (maxValue) => {
  if (maxValue <= 20) return [0, 5, 10, 15, 20];
  if (maxValue <= 50) return [0, 10, 20, 30, 40, 50];
  if (maxValue <= 100) return [0, 20, 40, 60, 80, 100];
  return [0, 50, 100, 150, 200];
};

const TraineeLineChart = ({
  technical,
  data,
  startDate,
  endDate,
  linesConfig,
}) => {
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

  const maxDataValue = Math.max(
    ...data.flatMap((entry) =>
      Object.values(entry).filter((value) => typeof value === "number")
    )
  );

  const isEmptyData = data.length === 0 || filteredConfig.length === 0;

  return (
    <div className="w-full h-[320px] border-gray-300 rounded-lg">
      {isEmptyData ? (
        <div className="flex items-center text-3xl italic text-slate-500 justify-center h-full">
          <p>No Data Available</p>
        </div>
      ) : (
        <>
          <div className="text-center mb-2 italic text-slate-500 font-semibold">
            {startDate && endDate && (
              <span>
                Data Range: {startDate} - {endDate}
              </span>
            )}
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              connectNulls
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="labelDate"
                padding={{ left: 20, right: 20 }}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                ticks={generateTicks(maxDataValue)}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Legend />
              {filteredConfig
                .filter(({ dataKey }) => visibleLines.includes(dataKey))
                .map(({ dataKey }, index) => (
                  <Line
                    key={dataKey}
                    type="monotone"
                    dataKey={dataKey}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={3}
                    dot={{ r: 1.5 }}
                    activeDot={{ r: 3 }}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default TraineeLineChart;
