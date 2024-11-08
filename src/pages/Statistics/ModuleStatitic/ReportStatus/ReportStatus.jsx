import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div className="bg-gray-200 text-gray-800 p-2 rounded shadow-md text-center">
        <p className="text-lg font-semibold">{name}</p>
        
      </div>
    );
  }
  return null;
};

const ReportStatus = ({ data, colors }) => {
  // If data is empty, show a message or a placeholder percentage
  if (!data || data.length === 0) {
    return <p className="text-center text-lg">No report data available</p>;
  }

  // Calculate the "On going" percentage
  const ongoingPercentage = data.find((item) => item.name === "On going")?.value || 0;

  return (
    <div className="p-6">
      <h3 className="text-center text-lg font-semibold mb-4">Report Status</h3>
      <ResponsiveContainer width="100%" height={500}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={130}
            outerRadius={170}
            startAngle={90}
            endAngle={450}
            dataKey="value"
            cornerRadius={100}
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
            dy={8}
            textAnchor="middle"
            className="text-3xl font-semibold text-gray-800"
          >
            {ongoingPercentage}%
          </text>
          <text
            x="50%"
            y="45%"
            textAnchor="middle"
            fill="#4B5563"
            className="text-xl bg-gray-200 px-2 pt-5 rounded-full"
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
