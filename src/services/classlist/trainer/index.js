// api.js
import axios from "axios";

export const fetchClassListApi = async (username,token) => {
  try {
    const response = await axios.get(
      `https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/trainer/confirm-module/get-list-class/${username}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data.classConfirmations;
  } catch (error) {
    console.error("Failed to fetch class list", error);
    throw error;
  }
};
