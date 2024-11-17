import axios from 'axios';


export const fetchTrainerUnitPrices = async (account, token) => {
  try {
    const response = await axios.get(
      `http://fams-app.ap-southeast-2.elasticbeanstalk.com/api/v1/trainer/get-info/${account}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    return response.data;
  } catch (error) {
    //    console.error('Error fetching trainer unit prices:', error.response ? error.response.data : error.message);
    throw new Error('Failed to fetch trainer unit prices');
  }
};

export const updateTrainerUnitPrices = async (trainerUnitPriceList, token) => {
  //console.log('trainerUnitPriceList', trainerUnitPriceList);
  try {
    const response = await axios.post(
      'http://fams-app.ap-southeast-2.elasticbeanstalk.com/api/v1/trainer/unit-price/update',
      trainerUnitPriceList,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating trainer unit prices:', error.response ? error.response.data : error.message);
    throw new Error('Failed to update trainer unit prices');
  }
};
// In your api/AdminAPI/Unit_Prices_API.js
export const addTrainerUnitPrice = async (unitPrices, token) => {
  const response = await fetch('http://fams-app.ap-southeast-2.elasticbeanstalk.com/api/v1/trainer/unit-price/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(unitPrices), // Ensure this is an array
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return await response.json();
};


export const deleteTrainerUnitPrices = async (unitPriceIds, token) => {
  try {
    const response = await axios.post(
      "http://fams-app.ap-southeast-2.elasticbeanstalk.com/api/v1/trainer/unit-price/delete-multi", // Replace with your actual delete API endpoint
      unitPriceIds, // Pass the array directly as the request body
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include token for authentication
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting trainer unit prices:", error);
    throw error; // Rethrow the error so it can be handled in the component
  }
};
