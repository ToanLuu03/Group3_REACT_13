import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Sector,
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

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const ClassStatusPieChart = ({ data, ariaLabelledby }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const renderActiveShape = ({
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
  }) => {
    if (!cx || !cy) return null;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius - 10}
          outerRadius={outerRadius + 5}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              label={renderCustomizedLabel}
              outerRadius={130}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>

            <Tooltip
              content={({ active, payload }) =>
                active && payload && payload[0]?.name ? (
                  <div className="bg-gray-200 text-sm border rounded-full px-2 py-1">
                    <p>
                      {payload[0].name} {payload[0].value}
                    </p>
                  </div>
                ) : null
              }
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[300px] text-center text-xl italic text-gray-500">
          No data available
        </div>
      )}
      <h3
        id="chart-description"
        className="text-center italic text-sm text-gray-500 mt-2"
      >
        {ariaLabelledby}
      </h3>
    </>
  );
};

export default ClassStatusPieChart;
