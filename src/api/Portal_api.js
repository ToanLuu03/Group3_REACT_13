import axios from 'axios';

const API_BASE_URL = 'https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/trainer-management/portal';


export const fetchDataGpa = () => {
  const accountUsername = localStorage.getItem('username'); // Get username from local storage

  return axios.get(`${API_BASE_URL}/${accountUsername}`);
};

export const fetchDataFeedback = () => {
    return axios.get('https://66d92d3e4ad2f6b8ed53a5e5.mockapi.io/api/feedbackData');
  };


// Add more API calls as needed