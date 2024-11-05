// components/DeliveryTypePieChart.js
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const DeliveryType = ({ data, colors, renderLabel }) => (
  <div className="p-6">
    <h3 className="text-center text-lg font-semibold mb-4">Delivery Type Distribution</h3>
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderLabel}
          outerRadius={140}
          fill="#8884d8"
          dataKey="value"
          className="font-medium text-2xl"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default DeliveryType;
