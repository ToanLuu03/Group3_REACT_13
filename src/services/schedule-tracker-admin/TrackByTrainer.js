import { instance } from "../instance"; 

export const TrackByTrainer = async (accessToken) => {
  try {
    const response = await instance.get(
      "admin/schedule-tracker?option=TRAINER",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching trainer data", error);
    throw error; 
  }
};
