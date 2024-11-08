import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const DeliveryType = ({ data, colors }) => (
  <div className="p-6">
    <h3 className="text-center text-lg font-semibold mb-4">Delivery Type Distribution</h3>
    <ResponsiveContainer width="100%" height={500}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={200}
          fill="#8884d8"
          dataKey="value"
          className="font-medium text-2xl"
          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
            // Position label inside each slice
            const RADIAN = Math.PI / 180;
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
              <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                className="font-medium text-lg"
              >
                {`${(percent * 100).toFixed(0)}%`}
              </text>
            );
          }}
          labelLine={false} // Disable label line
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>

        {/* Custom Tooltip */}
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const { name, value } = payload[0].payload;
              return (
                <div className="bg-gray-200 p-2 shadow-md rounded text-gray-800">
                  <p className="font-semibold">{name}</p>
                  
                </div>
              );
            }
            return null;
          }}
          cursor={{ fill: 'transparent' }}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default DeliveryType;
