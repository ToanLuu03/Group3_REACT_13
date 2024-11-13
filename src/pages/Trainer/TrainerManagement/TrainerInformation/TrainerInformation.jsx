import React, { useState } from "react";
import { Button, Spin } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import GeneralInfo from "./GeneralInfo";
import ProfessionalSkills from "./ProfessionalSkills";
import { useSelector } from "react-redux";

const TrainerInformation = ({ selectedTrainer }) => {
  const trainerData = useSelector((state) => state.trainer.trainerInfo);
  const [dropdownState, setDropdownState] = useState({
    generalInfo: false,
    skills: false,
  });

  const toggleDropdown = (section) => {
    setDropdownState((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Check if `trainerData` is null, undefined, or an empty object
  const isTrainerDataEmpty = !trainerData || Object.keys(trainerData).length === 0;

  if (isTrainerDataEmpty) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-200 bg-opacity-75 flex justify-center items-center">
          <Spin size="large" tip="Loading..." />
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:p-3 lg:p-2">
      <div className="h-full">
        <Button
          onClick={() => toggleDropdown("generalInfo")}
          className="w-full h-12 font-bold flex justify-between items-center bg-gray-200 text-sm md:text-base lg:text-lg rounded-lg shadow-sm"
        >
          <span>General Info</span>
          {dropdownState.generalInfo ? <UpOutlined /> : <DownOutlined />}
        </Button>
        {dropdownState.generalInfo && (
          <div className="">
            <GeneralInfo userInfoData={selectedTrainer} />
          </div>
        )}
      </div>

      <div className="h-full">
        <Button
          onClick={() => toggleDropdown("skills")}
          className="w-full h-12 font-bold flex justify-between items-center bg-gray-200 text-sm md:text-base lg:text-lg rounded-lg shadow-sm mt-5"
        >
          <span>Professional Skills</span>
          {dropdownState.skills ? <UpOutlined /> : <DownOutlined />}
        </Button>
        {dropdownState.skills && (
          <div className="mt-4">
            <ProfessionalSkills />
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerInformation;
