import React from "react";

const Counter = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-5">
      {data.map((item, index) => (
        <div
          key={index}
          className="bg-blue-950 text-white rounded-xl flex items-center justify-around p-5"
        >
          <div className="font-medium text-xl">
            <p>{item.value}</p>
            {item.label}
          </div>
          <item.icon className="size-14 rounded-full p-1  bg-purple-900" />
        </div>
      ))}
    </div>
  );
};

export default Counter;