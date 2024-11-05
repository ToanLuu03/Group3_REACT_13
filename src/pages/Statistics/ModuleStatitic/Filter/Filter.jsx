// components/Filter.js
import React from "react";

const Filter = ({ options }) => {
  return (
    <div className="flex justify-center gap-24 mb-8">
      {options.map((placeholder, index) => (
        <select
          key={index}
          className="border border-gray-300 rounded-xl px-6 py-2 mx-2 bg-white text-gray-600 focus:outline-none shadow-sm w-[220.25px]"
        >
          <option>{placeholder}</option>
        </select>
      ))}
    </div>
  );
};

export default Filter;
