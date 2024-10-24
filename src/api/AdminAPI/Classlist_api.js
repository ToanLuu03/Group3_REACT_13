import axios from 'axios';


const token = localStorage.getItem('token');

export const fetchClassList = async (trainerAcc) => {
  try {
      const response = await axios.get(`https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/trainer/get-info/${trainerAcc}`, {
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

export const fetchModuleDetail = async (moduleId) => { // Accept moduleId as a parameter
  try {
      const response = await axios.get(`https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/trainer/module/get-info/${moduleId}`, { // Use moduleId in the URL
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


export const fetchFeedBack = async (moduleId, trainerAccount ) => { 
    try {
        const response = await axios.get(`https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/modules/feedbacks/${moduleId}`, { 
            params: {
                trainerAccount
            },
            headers: {
                Authorization: `Bearer ${token}` // Add authorization token
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching feedback:', error);
        throw new Error('Failed to fetch feedback details');
    }
};



