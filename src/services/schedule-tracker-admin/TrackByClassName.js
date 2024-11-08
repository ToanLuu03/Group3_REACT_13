import { instance } from "../instance"; 

export const TrackByClassName = async (accessToken) => {
  try {
    const response = await instance.get(
      "v1/admin/schedule-tracker?option=CLASS",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching class data", error);
    throw error; 
  }
};
