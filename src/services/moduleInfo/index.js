// src/api.js

import { instance } from "../instance";


export const fetchModuleData = async (moduleId, token) => {
  try {
    const response = await instance.get(`/v1/trainer/module/get-info/${moduleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch module details");
  }
};
