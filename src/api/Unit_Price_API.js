import axios from 'axios';

export const fetchTrainers = async () => {
  try {
    const response = await axios.get('https://66fce728c3a184a84d1851eb.mockapi.io/api/prices');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
