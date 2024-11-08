import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  ChartDataLabels
);

const colors = ["#B4BAC4", "#4D48C7", "#5750DF"];

const GPAChart = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return { labels: [], datasets: [] };

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
      if (!acc[item.className]) acc[item.className] = {};
      acc[item.className][yearLabel] = item.gpa;
      return acc;
    }, {});

    const datasets = Object.keys(classGpaMap).map((className, index) => ({
      label: className,
      data: labels.map((label) => classGpaMap[className][label] || ""),
      backgroundColor: colors[index % colors.length],
      barThickness: 60,
    }));

    return { labels, datasets };
  }, [data]);

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `GPA: ${context.raw}`,
        },
      },
      datalabels: {
        anchor: "end",
        align: "end",
        color: "#000",
        formatter: (value) => value,
      },
    },
  };

  return (
    <div className="p-4 w-full space-y-6">
      <h1 className="text-center text-5xl font-semibold text-gray-500">
        GPA Bar Chart
      </h1>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default GPAChart;
