// src/components/GPAChart.js

import React from 'react';
import { Bar } from 'react-chartjs-2';

const GPAChart = () => {
  const data = {
    labels: ['HTML CSS (2022)', 'JS (2023)', 'ReactJS (2024)'],
    datasets: [
      {
        label: 'Java01',
        data: [8.7, 6.7, 9.8],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Java02',
        data: [7.7, 7.7, 8.8],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Java03',
        data: [8.2, 6.4, 4.4],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const options = {
    scales: {
      y: { beginAtZero: true, max: 10 },
    },
  };

  return (
    <div className="p-4">
      <h2 className="text-center text-lg font-semibold">GPA Bar Chart</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default GPAChart;
