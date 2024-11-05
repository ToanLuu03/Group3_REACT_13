import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
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
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5 - 15;
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
      {percent * 100 >= 10 ? `${(percent * 100).toFixed(0)}%` : ""}
    </text>
  );
};

const TechnicalGroupPieChart = ({ data, totalClasses, ariaLabelledby }) => {
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
          outerRadius={outerRadius + 4}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              labelLine={false}
              label={renderCustomizedLabel}
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={130}
              dataKey="value"
              startAngle={90}
              endAngle={450}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <text
              x="50%"
              y="50%"
              dy={8}
              textAnchor="middle"
              fill="#333"
              fontSize={16}
              fontWeight="400"
            >
              {totalClasses} Classes
            </text>
            <Pie
              data={[{ value: 1 }]}
              cx="50%"
              cy="50%"
              dataKey="value"
              innerRadius={75}
              outerRadius={75}
              fill="none"
              stroke="#CCCCCC"
              strokeDasharray="1 3"
              strokeWidth={1}
              isAnimationActive={false}
            />
            <Pie
              data={[{ value: 1 }]}
              cx="50%"
              cy="50%"
              dataKey="value"
              innerRadius={64.8}
              outerRadius={64.8}
              fill="none"
              stroke="#ccc"
              strokeWidth={1}
              isAnimationActive={false}
            />
            <Pie
              data={[{ value: 1 }]}
              cx="50%"
              cy="50%"
              dataKey="value"
              innerRadius={65}
              outerRadius={70}
              fill="#f2f1f1"
              stroke="#f2f1f1"
              strokeWidth={1}
              isAnimationActive={false}
            />
            <Tooltip
              formatter={(value, name) => [`${value}%`, name]}
              content={({ active, payload }) =>
                active && payload && payload[0]?.name ? (
                  <div className="bg-gray-200 text-sm border rounded-full px-2 py-1">
                    <p>
                      {payload[0].name} {`${payload[0].value}`}
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
        className="text-center italic text-sm text-gray-500"
      >
        {ariaLabelledby}
      </h3>
    </>
  );
};

export default TechnicalGroupPieChart;
