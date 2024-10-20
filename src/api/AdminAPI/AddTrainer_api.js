import axios from 'axios';

export const AddTrainer_api = async (trainerData, token) => {
  try {
    const response = await axios.post(
      'https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/trainer/add-trainer',
      trainerData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to add trainer:', error);
    throw error;
  }
};
