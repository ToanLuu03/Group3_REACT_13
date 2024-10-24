import React, { useState } from "react";
import TrainerGPA from "./TrainerGPA/TrainerGPA";
import TrainerFeedback from "./TrainerFeedback/TrainerFeedback";

const TrainerPortal = () => {
  const [activeCategory, setActiveCategory] = useState(0);

  const categories = [
    { name: "GPA", link: "/gpa" },
    { name: "Feedback", link: "/feedback" },
  ];

  return (
    <>
      <div className="w-full border-b-2 border-gray-200 flex justify-center">
        <nav className="flex">
          {categories.map((category, index) => (
            <div key={index} className="p-4 relative">
              <button
                onClick={() => setActiveCategory(index)}
                className={`text-gray-700 hover:text-purple-500 focus:outline-none ${
                  activeCategory === index ? "text-purple-500" : ""
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

      <div className="mt-8">
        {activeCategory === 0 && <TrainerGPA />}
        {activeCategory === 1 && <TrainerFeedback />}
      </div>
    </>
  );
};

export default TrainerPortal;
