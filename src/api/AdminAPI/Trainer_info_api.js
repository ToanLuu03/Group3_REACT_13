import axios from 'axios';
import useEffect from 'react';

// Get the token from local storage
const token = localStorage.getItem('token')

// Fetch trainer information based on account
export const fetchTrainerInfo = async (account) => {
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


