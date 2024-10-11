import axios from 'axios';

const API_BASE_URL = 'https://66d92d3e4ad2f6b8ed53a5e5.mockapi.io/api';

export const fetchDataGpa = () => {
  return axios.get(`${API_BASE_URL}/gpaData`);
};

export const fetchDataFeedback = () => {
    return axios.get(`${API_BASE_URL}/feedbackData`);
  };


// Add more API calls as needed