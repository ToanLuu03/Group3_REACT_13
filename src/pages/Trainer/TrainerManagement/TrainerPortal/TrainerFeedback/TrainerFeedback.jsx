import React, { useState, useEffect } from "react";
import SelectOptions from "../../../../../components/portal/SelectOptions";
import SelectDateRange from "../../../../../components/portal/SelectDateRange";
import BarChart from "../../../../../components/portal/BarChart";

const TrainerFeedback = () => {
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");

  const MetricOptions = [
    { value: "understandable", label: "Understandable" },
    { value: "fully", label: "Fully Transferred" },
    { value: "knowledge", label: "Knowledge" },
  ];

  const ClassesOptions = [
    { value: "class-1", label: "Java01" },
    { value: "class-2", label: "React01" },
    { value: "class-3", label: "React02" },
  ];

  const feedbackData = {
    "class-1": {
      understandable: [4.3, 3.5, 4.0],
      fully: [3.7, 4.2, 4.5],
      knowledge: [4.0, 4.5, 3.8],
    },
    "class-2": {
      understandable: [4.1, 4.0, 3.8],
      fully: [3.9, 4.1, 4.3],
      knowledge: [4.5, 4.2, 4.0],
    },
    "class-3": {
      understandable: [3.8, 3.5, 4.0],
      fully: [3.6, 3.9, 4.1],
      knowledge: [4.2, 4.0, 3.9],
    },
  };

  const [chartData, setChartData] = useState({
    labels: ["HTML CSS", "JS", "ReactJS"],
    datasets: [],
  });

  useEffect(() => {
    updateChartData();
  }, [selectedMetrics, selectedClass]);

  const updateChartData = () => {
    if (!selectedClass || selectedMetrics.length === 0) {
      setChartData({ labels: ["HTML CSS", "JS", "ReactJS"], datasets: [] });
      return;
    }
    const selectedClassData = feedbackData[selectedClass] || {};

    const datasets = [
      {
        label: "2022",
        data: selectedMetrics.map(
          (metric) => selectedClassData[metric]?.[0] || 0
        ),
        backgroundColor: "rgba(75, 92, 155)",
      },
      {
        label: "2023",
        data: selectedMetrics.map(
          (metric) => selectedClassData[metric]?.[1] || 0
        ),
        backgroundColor: "rgba(53, 152, 206)",
      },
      {
        label: "2024",
        data: selectedMetrics.map(
          (metric) => selectedClassData[metric]?.[2] || 0
        ),
        backgroundColor: "rgba(108, 119, 147)",
      },
    ];

    setChartData({
      labels: selectedMetrics.map(
        (metric) =>
          metric.charAt(0).toUpperCase() + metric.slice(1).replace("-", " ")
      ),
      datasets: datasets,
    });
  };

  const handleMetricChange = (value) => {
    setSelectedMetrics(value);
    console.log("Selected Metrics: ", value);
  };

  const handleClassChange = (value) => {
    setSelectedClass(value);
    console.log("Selected Class: ", value);
  };

  return (
    <div className="flex flex-col items-center m-8">
      <div className="flex gap-20">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Select metrics</h2>
          <SelectOptions
            mode={"multiple"}
            options={MetricOptions}
            onChange={handleMetricChange}
          />
        </div>

        <div className="flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Select class</h2>
          <SelectOptions
            options={ClassesOptions}
            onChange={handleClassChange}
          />
        </div>

        <div className="flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Select Date Range</h2>
          <SelectDateRange />
        </div>
      </div>

      <div className="w-[800px] h-auto">
        <h2 className="text-3xl font-semibold text-gray-400 text-center mt-6 mb-4">
          Feedback Bar Chart
        </h2>
        {selectedMetrics.length === 0 || !selectedClass ? (
          <p className="text-center text-red-500">
            Please select a metric and a class to show the bar chart.
          </p>
        ) : (
          <BarChart data={chartData} max={5} />
        )}
      </div>
    </div>
  );
};

export default TrainerFeedback;
