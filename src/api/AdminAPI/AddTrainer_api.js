import axios from 'axios';

export const AddTrainer_api = async (trainerData, token) => {
  try {
    const response = await axios.post(
      'http://fams-app.ap-southeast-2.elasticbeanstalk.com/api/v1/trainer/add-trainer',
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
