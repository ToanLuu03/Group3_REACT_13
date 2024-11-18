import axios from 'axios';

const API_BASE_URL = 'https://fams.ap-southeast-1.elasticbeanstalk.com/api/v1/trainer-management/portal';


export const fetchDataGpa = () => {
  const trainerAccount = localStorage.getItem('trainerAccount'); // Get username from local storage

  return axios.get(`${API_BASE_URL}/${trainerAccount}`);
};

export const fetchDataFeedback = () => {
  return axios.get('http://fams-app.ap-southeast-2.elasticbeanstalk.com/api/feedbackData');
};


// Add more API calls as needed