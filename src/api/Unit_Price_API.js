import axios from 'axios';

export const fetchTrainers = async () => {
  try {
    const response = await axios.get('http://fams-app.ap-southeast-2.elasticbeanstalk.com/api/prices');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
