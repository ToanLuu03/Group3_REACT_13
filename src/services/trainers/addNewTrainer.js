import { instance } from "../instance";

export const addNewTrainer = async (trainerData, token) => {
  try {
    const response = await instance.post(
      "v1/trainer/add-trainer",
      trainerData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error saving trainer profile:", error);
    throw error;
  }
};
