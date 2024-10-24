import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const BarChart = ({ data, max }) => {
  // Chart data

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: max,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      datalabels: {
        anchor: "end",
        align: "end",
        offset: -5,
        color: "#000",
        font: {
          weight: "bold",
        },
        formatter: (value) => value,
      },
    },
  };

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
