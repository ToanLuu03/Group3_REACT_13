import React from "react";

const Counter = ({ data }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5  ">
      {data.map((item, index) => (
        <div
          key={index}
          className="bg-blue-950 text-white rounded-xl flex items-center justify-between p-5"
        >
          <div>
            <p className="font-semibold text-xl">{item.value}</p>
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
