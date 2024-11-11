import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const DeliveryType = ({ data, colors }) => (
  <div >
    <h3 className="text-center text-lg font-semibold ">Delivery Type Distribution</h3>
    <ResponsiveContainer
      width="100%"
      height="100%"
      minHeight={300} // Set minimum height for better responsiveness
      maxHeight={500} // Limit max height on larger screens
    >
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={window.innerWidth < 768 ? "70%" : "80%"} // Scaled radius for mobile and larger screens
          fill="#8884d8"
          dataKey="value"
          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
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
                style={{
                  fontSize: window.innerWidth < 768 ? "12px" : "16px", // Smaller font on mobile
                  fontWeight: "500",
                }}
              >
                {`${(percent * 100).toFixed(0)}%`}
              </text>
            );
          }}
          labelLine={false}
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
                  <p>{`Value: ${value}`}</p>
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
