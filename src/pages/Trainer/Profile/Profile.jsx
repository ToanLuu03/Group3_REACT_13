import React, { useEffect, useState } from "react";
import TrainerInformation from "./TrainerInformation/TrainerInformation";
import CVHistory from "./CVHistory/CVHistory";
import { Button, notification } from "antd";
import {
  fetchMasterData,
  fetchTrainerInfoV2,
} from "../../../api/AdminAPI/Trainer_info_api";

const TrainerProfile = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const [dataInfoV2, setDataInfoV2] = useState(null);
  const [masterData, setMasterData] = useState(null);
  const account = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const handleEditClick = () => setIsEditing(true);

  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        const data = await fetchTrainerInfoV2(account, token);
        setDataInfoV2(data);
      } catch (error) {
        notification.error({
          message:
            error.response?.data?.message || "Error Fetching Trainer Data",
          description: "Please try again later.",
          duration: 3,
        });
      }
    };

    fetchTrainerData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMasterData(token);
        setMasterData(data);
      } catch (error) {
        notification.error({
          message: "Error Fetching Master Data",
          description: "Please try again later.",
          duration: 3,
        });
      }
    };

    fetchData();
  }, []);

  const ProfileCategory = [
    {
      name: "Trainer Information",
      component: (
        <TrainerInformation
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          dataInfoV2={dataInfoV2}
          masterData={masterData}
        />
      ),
    },
    {
      name: "View CV History",
      component: <CVHistory trainerData={dataInfoV2} />,
    },
  ];

  return (
    <div className="pt-16 px-4 md:px-8">
      <div className="w-full border-b">
        <div className="flex flex-col md:flex-row justify-between items-center pb-2">
          <h1 className="text-xl md:text-2xl font-bold">
            {isEditing ? "Edit Trainer Profile" : "Trainer Profile"}
          </h1>
          {!isEditing && (
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button className="bg-[#5750DF] text-white hover:bg-blue-600 px-4 py-1 md:py-2 rounded-full">
                Export
              </Button>
              {activeCategory === 0 && (
                <Button
                  type="primary"
                  onClick={handleEditClick}
                  className="w-full md:w-auto text-sm md:text-base px-4 py-1 md:py-2 rounded-full"
                >
                  Update
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {!isEditing && (
        <nav className="flex justify-start mt-4 overflow-x-auto">
          {ProfileCategory.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(index)}
              className={`mr-4 ${
                activeCategory === index ? "text-purple-500" : ""
              }`}
            >
              {category.name}
            </button>
          ))}
        </nav>
      )}

      <div className="mt-8">{ProfileCategory[activeCategory].component}</div>
    </div>
  );
};

export default TrainerProfile;
