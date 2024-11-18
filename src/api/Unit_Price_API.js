import axios from 'axios';
import { instance } from '../instance';
export const fetchTrainers = async () => {
  try {
    const response = await instance.get('prices');
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
