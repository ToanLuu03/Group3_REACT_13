import React, { useState } from "react";
import { Button } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import GeneralInfo from "./GeneralInfo";
import ProfessionalSkills from "./ProfessionalSkills";

const TrainerInformation = ({ selectedTrainer }) => {
  const [dropdownState, setDropdownState] = useState({
    generalInfo: false,
    skills: false,
  });

  const toggleDropdown = (section) => {
    setDropdownState((prev) => ({ ...prev, [section]: !prev[section] }));
  };

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
