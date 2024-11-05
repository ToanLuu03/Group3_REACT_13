import axios from 'axios';


const token = localStorage.getItem('token');

export const fetchClassList = async () => {
    

  try {
      const response = await axios.get('https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v3/classes/class-list', {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      return response.data;
  } catch (error) {
      console.error('Error fetching :', error);
      throw new Error('Failed to fetch classlist');
  }
};


export const fetchClassDetail = async (classId) => { 

  try {
      const response = await axios.get(`https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v3/classes/class-detail/${classId}`, { // Use moduleId in the URL
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      return response.data;
  } catch (error) {
      console.error('Error fetching :', error);
      throw new Error('Failed to fetch module details'); // Updated error message
  }
};

