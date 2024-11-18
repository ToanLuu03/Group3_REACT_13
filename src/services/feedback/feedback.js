// src/api.js
import { instance } from '../instance';

export const fetchFeedbackData = async (moduleId, trainerAccount, token) => {
  try {
    const response = await instance.get(`/v1/modules/feedbacks/${moduleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        trainerAccount,
      },
    });

    return response.data.data; // Adjust based on your API's response structure
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch feedback data');
  }
};
