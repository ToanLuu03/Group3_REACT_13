import React from "react";
import CountUp from "react-countup";
import { MdHome, MdPerson, MdSettings, MdAccessTime } from "react-icons/md";

const Counter = ({ data, isLoading }) => {
  const defaultData = [
    { value: 0, label: "Total Modules", icon: MdHome },
    { value: 0, label: "Total Contents", icon: MdSettings },
    { value: 0, label: "Total Trainers", icon: MdPerson },
    { value: 0, label: "Total Duration", icon: MdAccessTime },
  ];

  const displayedData = data.length === 4 ? data : defaultData;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
      {displayedData.map((item, index) => (
        <div
          key={index}
          className="bg-blue-950 text-white rounded-xl flex items-center justify-between p-5"
        >
          <div>
            <p className="font-semibold text-xl">
              <CountUp
                end={isLoading ? 0 : item.value}
                duration={2}
                preserveValue
              />
            </p>
            <p className="font-normal text-lg">{item.label}</p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-900">
            <item.icon className="w-6 h-6 text-white" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Counter;
