import React from "react";

const TimeRangeButtons = ({ activeButton, onClick, buttonOptions }) => {
  return (
    <ul className="flex justify-center max-sm:block gap-5">
      {buttonOptions.map((option) => (
        <li key={option.value} className="max-sm:mb-1">
          <button
            className={`border w-36 px-1 py-[2px] border-gray-300 rounded-xl ${
              activeButton === option.value ? "bg-blue-950 text-white" : ""
            }`}
            onClick={() => onClick(option.value)}
          >
            {option.label}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TimeRangeButtons;
