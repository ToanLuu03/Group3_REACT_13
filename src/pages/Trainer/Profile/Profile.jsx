import React, { useState, useEffect } from "react";
import TrainerInformation from "./TrainerInformation/TrainerInformation";
import EditTrainerInformation from "./TrainerInformation/EditTrainerInformation";
import CVHistory from "./CVHistory/CVHistory";
import TrainerAPI from "../../../services/trainer";
import { message } from "antd";

const TrainerProfile = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [trainerData, setTrainerData] = useState({});
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchTrainerInfo = async () => {
      try {
        const response = await TrainerAPI.getTrainerProfile(token, username);
        if (response) {
          setTrainerData(response.data.trainerInfo);
        }
      } catch (error) {
        console.error("Error fetching trainer info:", error);
        message.error("Failed to fetch trainer information.");
      }
    };

    fetchTrainerInfo();
  }, [token, username]);

  const handleUpdateClick = () => {
    setIsEditing(true);
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveChanges = async (updatedData) => {
    try {
      const response = await TrainerAPI.updateTrainerProfile(token, username, updatedData);
      if (response) {
        setTrainerData(updatedData);
        setIsEditing(false);
        message.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating trainer profile:", error);
      message.error("Failed to update profile. Please try again.");
    }
  };

  const ProfileCategory = [
    { name: "Trainer Information", component: <TrainerInformation trainerData={trainerData} /> },
    { name: "View CV History", component: <CVHistory /> },
  ];

  return (
    <div className="pt-16 px-4 md:px-8">
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-center pb-2">
          <h1 className="text-xl md:text-2xl font-bold">
            {isEditing ? "Edit Trainer Profile" : "Trainer Profile"}
          </h1>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button className="bg-[#5750DF] text-white hover:bg-blue-600 px-2 py-1 md:px-4 md:py-2 rounded-full">
              Export
            </button>
          </div>
        </div>
      </div>

      <nav className="flex justify-start mt-4 overflow-x-auto">
        {ProfileCategory.map((category, index) => (
          <button
            key={index}
            onClick={() => setActiveCategory(index)}
            className={`mr-4 ${activeCategory === index ? "text-purple-500" : ""
              }`}
          >
            {category.name}
          </button>
        ))}
      </nav>

      <div className="mt-8">
        {isEditing ? (
          <EditTrainerInformation
            onSaveChanges={handleSaveChanges}
            trainerData={trainerData}
            onCancelEdit={handleCancelEdit}
          />
        ) : (
          ProfileCategory[activeCategory].component
        )}
      </div>
    </div>
  );
};

export default TrainerProfile;
