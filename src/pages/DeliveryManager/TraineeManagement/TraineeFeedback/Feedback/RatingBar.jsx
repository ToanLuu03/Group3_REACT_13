import React from "react";

const RatingBar = ({ rating }) => {
  const segmentCount = rating > 5 ? 10 : 5;

  return (
    <div className="flex space-x-1 w-full">
      {[...Array(segmentCount)].map((_, index) => (
        <div
          key={index}
          className={`h-2 flex-grow ${
            index < rating ? "bg-blue-500" : "bg-gray-200"
          }`}
        ></div>
      ))}
    </div>
  );
};

export default RatingBar;
