import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ClassInfo from "./ClassInfo";
import TraineeList from "./TraineeList";

const ClassDetail = () => {
  const { className } = useParams(); // Lấy classCode từ URL
  const [activeTabs, setActiveTab] = useState("info");
  const role = useSelector((state) => state.role.selectedRole.role);
  const navigate = useNavigate();
  if (!className) {
    return <div>Class not found</div>;
  }
  const handleBack = () => {
    navigate(`/${role}/trainer-confirmation`);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex gap-4 mb-6 border-b mt-16 py-2 w-full">
        <h2 className="text-2xl font-bold ">
          Class Detail: {className}
        </h2>
        <div className=" mb-1 mt-1 px-3 py-1 text-xs rounded-full bg-[#D8FAE6] text-[#648A77]">
          In Progress
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-5 mb-6 ">
        <div className="relative p-1">
          {/*class info */}
          <button
            onClick={() => setActiveTab("info")}
            className={`text-gray-700 hover:text-purple-500 focus:outline-none ${
              activeTabs === "info" ? "text-purple-500" : ""
            }`}
          >
            Class Info
          </button>
          {activeTabs === "info" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500"></div>
          )}
        </div>
        <div className="relative p-1">
          {/*trainee list */}
          <button
            onClick={() => setActiveTab("trainee")}
            className={`text-gray-700 hover:text-purple-500 focus:outline-none ${
              activeTabs === "trainee" ? "text-purple-500" : ""
            }`}
          >
            Trainee List
          </button>
          {activeTabs === "trainee" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500"></div>
          )}
        </div>
      </div>

      {/* Class Info Table */}
      {activeTabs === "info" && <ClassInfo />}
      {activeTabs === "trainee" && <TraineeList />}

      {/* Back Button */}
      <div className="mt-6 border-t">
        <button
          onClick={handleBack}
          className="px-6 py-2 mt-2 text-black border-2 rounded-full font-bold"
        >
          Back to Trainer Confirmation
        </button>
      </div>
    </div>
  );
};

export default ClassDetail;
