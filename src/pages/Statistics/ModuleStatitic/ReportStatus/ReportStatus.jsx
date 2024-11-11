import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div className="bg-gray-200 text-gray-800 p-2 rounded shadow-md text-center">
        <p className="text-lg font-semibold">{name}</p>
        <p className="text-sm">{value}%</p>
      </div>
    );
  }
  return null;
};

const ReportStatus = ({ data, colors }) => {
  // Handle case when data is missing or empty
  if (!data || data.length === 0) {
    return <p className="text-center text-lg">No report data available</p>;
  }

  // Calculate the "On going" percentage
  const ongoingData = data.find((item) => item.name === "On going");
  const ongoingPercentage = ongoingData ? ongoingData.value : 0;
  const fontSize = window.innerWidth < 768 ? "1.5rem" : "2.5rem";
  const subFontSize = window.innerWidth < 768 ? "0.5rem" : "1rem";
  
  return (
    <div>
      <h3 className="text-center text-lg font-semibold mb-4">Report Status</h3>
      <ResponsiveContainer
        width="100%"
        height={window.innerWidth < 768 ? 300 : 500} // Set responsive height
      >
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={window.innerWidth < 768 ? "50%" : "65%"} // Adjust inner radius for mobile
            outerRadius={window.innerWidth < 768 ? "70%" : "80%"} // Adjust outer radius for mobile
            startAngle={90}
            endAngle={450}
            dataKey="value"
            cornerRadius={10}
            paddingAngle={5}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>

          {/* Center text */}
          <text
            x="50%"
            y="50%"
            dy={0}
            textAnchor="middle"
            fontSize={fontSize}
            className="font-semibold text-gray-800"
          >
            {ongoingPercentage}%
          </text>
          <text
            x="50%"
            y="50%"
            dy={30} // Offset to place below the percentage text
            textAnchor="middle"
            fontSize={subFontSize}
            fill="#4B5563"
          >
            On going
          </text>

          {/* Tooltip */}
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportStatus;
