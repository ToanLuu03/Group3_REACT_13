import { instance } from '../instance'

export const AddTrainer_api = async (trainerData, token) => {
  try {
    const response = await instance.post(
      'v1/trainer/add-trainer',
      trainerData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error('Failed to add trainer:', error);
    throw error;
  }
};
