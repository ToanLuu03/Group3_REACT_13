import React, { useState, useEffect } from "react";
import Title from "../../../components/Header/Title/Title";
import Category from "../../../components/Header/Category/Category";
import { useDispatch, useSelector } from "react-redux";
import TrainerAPI from "../../../../src/services/trainer";
import { updateTrainerInfo } from "../../../features/trainerInfo/trainerSaga";

const TrainerManagementT = ({ collapsed }) => {
  // Lấy username và token từ Redux store
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const fetchFlag = useSelector((state) => state.trainer.fetchFlag);
  const trainerData = useSelector((state) => state.trainer.trainerInfo);

  const fetchTrainerInfo = async () => {
    try {
      const response = await TrainerAPI.gettrainerInfo(token, username);
      console.log("Fetched trainer info:", response.data);
      const trainerInfo = response.data;
      if (trainerInfo) {
        dispatch(updateTrainerInfo(trainerInfo));
      }
    } catch (error) {
      console.error("Failed to fetch trainer info:", error);
    }
  };

  useEffect(() => {
    fetchTrainerInfo();
  }, [fetchFlag]);

  return (
    <div className="mt-[60px]">
      <div className="mx-auto">
        <Title />
        <Category />
        {/* Add other content as needed */}
      </div>
    </div>
  );
};

export default TrainerManagementT;
