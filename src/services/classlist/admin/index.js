// api.js
import axios from "axios";

export const fetchClassListApi = async (selectedTrainer,token) => {
  try {
    const response = await axios.get(
      `https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/trainer/confirm-module/get-list-class/${selectedTrainer.account}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(selectedTrainer.account)
    return response.data.data.classConfirmations;
  } catch (error) {
    console.error("Failed to fetch class list", error);
    throw error;
  }
};
