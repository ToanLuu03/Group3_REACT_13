import React, { useState } from "react";
import ScheduleReport from "./ScheduleReport/ScheduleReport";
import ScheduleTraining from "./ScheduleTraining/ScheduleTraining";
import { TrackerCategory } from "./TrackerData";

const ScheduleTracker = () => {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <>
      {/* Responsive Nav Section */}
      <div className="w-full border-b-2 flex justify-center">
        <nav className="flex flex-wrap justify-center">
          {TrackerCategory.map((category, index) => (
            <div key={index} className="p-4 relative">
              <button
                onClick={() => setActiveCategory(index)}
                className={`text-gray-700 hover:text-purple-500 focus:outline-none ${activeCategory === index ? "text-purple-500" : ""
                  }`}
              >
                {category.name}
              </button>
              {activeCategory === index && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500"></div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Responsive Content Section */}
      <div className="p-4">
        {activeCategory === 0 && <ScheduleTraining />}
        {activeCategory === 1 && <ScheduleReport />}
      </div>
    </>
  );
};

export default ScheduleTracker;
