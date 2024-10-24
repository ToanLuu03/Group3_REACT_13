import axios from 'axios';

// Get the token from local storage


// Fetch trainer information based on account
export const fetchTrainerInfo = async (account, token) => {
    try {
        const response = await axios.get(`https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/trainer/get-info/${account}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log('Trainer Info Response:', response.data); // Log the API response

        if (response?.data?.data?.trainerInfo?.generalInfo) {
            return response.data.data.trainerInfo;
        } else {
            throw new Error('Trainer info is missing from the API response');
        }
    } catch (error) {
        console.error('Error fetching trainer info:', error.message);
        throw new Error('Failed to fetch trainer info');
    }
};

export const updateTrainerInfo = async (account, updatedData, token) => {
    try {
        const response = await axios.put(
            `https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/trainer/update-trainer/${account}`,
            updatedData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Trainer Update Response:', response.data); 
        return response.data;
    } catch (error) {
        console.error('Error updating trainer info:', error.message);
        throw new Error('Failed to update trainer info');
    }
};


