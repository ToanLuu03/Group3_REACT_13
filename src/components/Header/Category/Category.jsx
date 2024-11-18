// Admin imports
import PortalPage from "../../../pages/Admin/PortalPage/PortalPage";
import SchedulePage from "../../../pages/Admin/SchedulePage/SchedulePage";
import ClassList from "../../../pages/Admin/ClassListPages/ClassListPages";
import ModuleDetailsPageAD from "../../../pages/Admin/ClassListPages/ModuleDetailsPage";
import Feedback from "../../../pages/Admin/ClassListPages/Feedback";
import TrainerUinitPricePage from "../../../pages/Admin/TrainerUnitPricePage/TrainerUinitPricePage";
// import ScheduleTracker from "../../../pages/Admin/ScheduleTrackerPage/ScheduleTrackerPage";  
import TrainerProfile from "../../../pages/Admin/TrainerProfilePage/TrainerProfile";
// Trainer imports
import ClassListTrainer from "../../../pages/Trainer/TrainerManagement/ClassList/ClassList";
import TrainerInformationTrainer from "../../../pages/Trainer/TrainerManagement/TrainerInformation/TrainerInformation";
import TrainerPortalTrainer from "../../../pages/Trainer/TrainerManagement/TrainerPortal/TrainerPortal";
import ScheduleTrainer from "../../../pages/Trainer/TrainerManagement/Schedule/Schedule";
import ModuleInfoTrainer from "../../../pages/Trainer/TrainerManagement/ClassList/ModuleDetail/ModuleInfo";
import FeedbackTrainer from "../../../pages/Trainer/TrainerManagement/ClassList/ModuleDetail/Feedback";
import TrainerUnitPriceTrainer from "../../../pages/Trainer/TrainerManagement/TrainerUnitPrice/TrainerUnitPrice";
import ScheduleTrackerTrainer from "../../../pages/Trainer/TrainerManagement/ScheduleTracker/ScheduleTracker";

// Other
import React, { useEffect, useState } from "react";
import Title from "../Title/Title";
import ReportPage from "../../../pages/Admin/ReportPage/ReportPage";


const Category = ({ selectedTrainer }) => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [showModuleInfo, setShowModuleInfo] = useState(false);
  const [selectedModuleData, setSelectedModuleData] = useState(null);
  // Get the user's role from the Redux store
  const username = localStorage.getItem("username");

  const role = localStorage.getItem('role');
  
  const categories = showModuleInfo
    ? [
      { name: "Module Info", link: "/moduleinfo" },
      { name: "Feedback", link: "/feedback" },
    ]
    : role === "CLASS_ADMIN" || role === "DELIVERY_MANAGER"
      ? [
        { name: "Trainer Information", link: "/trainer-information" },
        { name: "Trainer Unit Price", link: "/trainer-unit-price" },
        { name: "Class List", link: "/class-list" },
        { name: "Schedule", link: "/schedule" },
        { name: "Schedule Tracker", link: "/schedule-tracker" },
        { name: "Portal", link: "/portal" },
      ]
      : [
        { name: "Trainer Information", link: "/trainer-information" },
        { name: "Trainer Unit Price", link: "/trainer-unit-price" },
        { name: "Class List", link: "/class-list" },
        { name: "Schedule", link: "/schedule" },
        { name: "Schedule Tracker", link: "/schedule-tracker" },
        { name: "Portal", link: "/portal" },
      ];

  const handleModuleClick = (moduleData) => {
    setSelectedModuleData(moduleData);
    setShowModuleInfo(true);
    setActiveCategory(0);
  };
  const handleBackToClassList = () => {
    setShowModuleInfo(false);
    setActiveCategory(2); // Reset to Class List
  };

  const showImportButton = activeCategory === 1 || activeCategory === 0;

  return (
    <div className="w-full border-gray-200">
      <Title
        selectedModuleData={selectedModuleData}
        title={`${categories[activeCategory].name} - ${selectedTrainer?.name || username
          }`}
        showImportButton={showImportButton}
      />

      {/* Responsive nav */}
      <nav className="flex flex-wrap sm:flex-nowrap justify-center md:justify-start space-x-4 md:space-x-2 p-4 gap-6">
        {categories.map((category, index) => (
          <div key={index} className=" relative">
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

      {/* Responsive content */}
      <div className="mt-3 px-4 md:px-6 lg:px-8">
        {role === "CLASS_ADMIN" || role === "DELIVERY_MANAGER"? (
          <>
            {!showModuleInfo && activeCategory === 0 && (
              <TrainerProfile selectedTrainer={selectedTrainer} />
            )}
            {!showModuleInfo && activeCategory === 1 && <TrainerUinitPricePage />}
            {!showModuleInfo && activeCategory === 2 && (
              <ClassList
                onModuleClick={handleModuleClick}
                selectedTrainer={selectedTrainer}
              />
            )}
            {!showModuleInfo && activeCategory === 3 && (
              <SchedulePage selectedTrainer={selectedTrainer} />
            )}

            {!showModuleInfo && activeCategory === 4 && <ReportPage />}
            {!showModuleInfo && activeCategory === 5 && <PortalPage />}
            {showModuleInfo && activeCategory === 0 && (
              <ModuleDetailsPageAD
                moduleData={selectedModuleData}
                onBackClick={handleBackToClassList}
              />
            )}
            {showModuleInfo && activeCategory === 1 && (
              <Feedback onBackClick={handleBackToClassList} />
            )}
          </>
        ) : (
          <>
            {!showModuleInfo && activeCategory === 0 && (
              <TrainerInformationTrainer selectedTrainer={selectedTrainer} />
            )}
            {!showModuleInfo && activeCategory === 1 && (
              <TrainerUnitPriceTrainer />
            )}
            {!showModuleInfo && activeCategory === 2 && (
              <ClassListTrainer
                onModuleClick={handleModuleClick}
                selectedTrainer={selectedTrainer}
              />
            )}
            {!showModuleInfo && activeCategory === 3 && (
              <ScheduleTrainer selectedTrainer={selectedTrainer} />
            )}
            {!showModuleInfo && activeCategory === 4 && (
              <ScheduleTrackerTrainer />
            )}
            {!showModuleInfo && activeCategory === 5 && (
              <TrainerPortalTrainer />
            )}
            {showModuleInfo && activeCategory === 0 && (
              <ModuleInfoTrainer
                moduleData={selectedModuleData}
                onBackClick={handleBackToClassList}
              />
            )}
            {showModuleInfo && activeCategory === 1 && (
              <FeedbackTrainer
                moduleData={selectedModuleData}
                onBackClick={handleBackToClassList}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Category;
