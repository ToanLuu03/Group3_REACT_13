// Dashboard.js
import React from "react";
import { MdHome, MdPerson, MdSettings } from "react-icons/md";
import Counter from "./Counter/Counter";
import Filter from "./Filter/Filter";
import DeliveryType from "./DeliveryType/DeliveryType";
import ReportStatus from "./ReportStatus/ReportStatus";

const ModuleStatistic = () => {
  const pieData = [
    { name: "Test/Quiz", value: 25 },
    { name: "Lecture", value: 35 },
    { name: "Other", value: 40 },
  ];

  const doughnutData = [
    { name: "On going", value: 70 },
    { name: "Remaining", value: 30 },
  ];

  const dataTotal = [
    { value: 10, label: "Total classes", icon: MdHome },
    { value: 300, label: "Total trainees", icon: MdPerson },
    { value: 5, label: "Total trainer", icon: MdPerson },
    { value: 4, label: "Technical groups", icon: MdSettings },
  ];

  const COLORS = ["#087BB3", "#08384F", "#34B3F15E"];
  const DOUGHNUT_COLORS = ["#000", "#E5E7EB"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5 - 15;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {percent * 100 >= 10 ? `${(percent * 100).toFixed(0)}%` : ""}
      </text>
    );
  };

  return (
    <div>
      <Counter data={dataTotal} />
      <Filter options={["Trainer", "Class", "Module"]} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <DeliveryType data={pieData} colors={COLORS} renderLabel={renderCustomizedLabel} />
        <ReportStatus data={doughnutData} colors={DOUGHNUT_COLORS} />
      </div>
    </div>
  );
};

export default ModuleStatistic;
