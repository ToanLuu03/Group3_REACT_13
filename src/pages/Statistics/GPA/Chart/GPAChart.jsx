import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  ReferenceLine,
} from "recharts";

const colors = ["#B4BAC4", "#4D48C7", "#5750DF"];

const GPAChart = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const labels = Array.from(
      new Set(
        data.map(
          (item) =>
            `${item.moduleName} (${new Date(item.endDate).getFullYear()})`
        )
      )
    );

    const classGpaMap = data.reduce((acc, item) => {
      const yearLabel = `${item.moduleName} (${new Date(
        item.endDate
      ).getFullYear()})`;
      if (!acc[yearLabel]) acc[yearLabel] = { label: yearLabel };
      acc[yearLabel][item.className] = item.gpa;
      return acc;
    }, {});

    return labels.map((label) => classGpaMap[label] || { label });
  }, [data]);

  return (
    <div className="w-full space-y-6">
      <h1 className="text-center text-5xl font-semibold text-gray-500">
        GPA Bar Chart
      </h1>
      <div className="overflow-x-auto">
        <div className="min-w-[1200px]"> {/* Adjust minimum width as needed */}
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} barCategoryGap="20%">
              <XAxis dataKey="label" />
              <YAxis domain={[0, 10]} />
              <Tooltip formatter={(value) => `GPA: ${value}`} />
              <Legend />
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((gpa) => (
                <ReferenceLine
                  key={gpa}
                  y={gpa}
                  stroke="black"
                  strokeDasharray="3 3"
                  strokeWidth={0.5}
                />
              ))}
              {Object.keys(chartData[0] || {})
                .filter((key) => key !== "label")
                .map((className, index) => (
                  <Bar
                    key={className}
                    dataKey={className}
                    fill={colors[index % colors.length]}
                    barSize={60}
                  >
                    <LabelList dataKey={className} position="top" />
                  </Bar>
                ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GPAChart;
