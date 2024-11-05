// components/ReportStatus.js
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const ReportStatus = ({ data, colors }) => (
  <div className="p-6">
    <h3 className="text-center text-lg font-semibold mb-4">Report Status</h3>
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={90}
          outerRadius={120}
          startAngle={90}
          endAngle={450}
          dataKey="value"
          cornerRadius={50}
          paddingAngle={5}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>

        <text
          x="50%"
          y="50%"
          dy={8}
          textAnchor="middle"
          className="text-3xl font-semibold text-gray-800"
        >
          70%
        </text>
        <text
          x="50%"
          y="40%"
          textAnchor="middle"
          fill="#4B5563"
          className="text-xl bg-gray-200 px-2 py-1 rounded-full"
        >
          On going
        </text>
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default ReportStatus;
