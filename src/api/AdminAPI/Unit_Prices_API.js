import { instance } from '../instance'

export const fetchTrainerUnitPrices = async (account, token) => {
  try {
    const response = await instance.get(
      `v1/trainer/get-info/${account}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    return response;
  } catch (error) {
    throw new Error('Failed to fetch trainer unit prices');
  }
};

export const updateTrainerUnitPrices = async (trainerUnitPriceList, token) => {
  try {
    const response = await instance.post(
      'v1/trainer/unit-price/update',
      trainerUnitPriceList,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw new Error('Failed to update trainer unit prices');
  }
};
// In your api/AdminAPI/Unit_Prices_API.js
export const addTrainerUnitPrice = async (unitPrices, token) => {
  const response = await fetch('https://fams-app.ap-southeast-2.elasticbeanstalk.com/api/v1/trainer/unit-price/update', {
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
    const response = await instance.post(
      "v1/trainer/unit-price/delete-multi", // Replace with your actual delete API endpoint
      unitPriceIds, // Pass the array directly as the request body
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include token for authentication
        },
      }
    );
    return response;
  } catch (error) {
    throw error; // Rethrow the error so it can be handled in the component
  }
};
