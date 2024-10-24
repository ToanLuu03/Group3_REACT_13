import axios from 'axios';

// Fetch token from localStorage
export const fetchClasses = async (token) => {
    try {
        const response = await axios.get(
            'https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/trainer/get-all',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        console.log('Response: ', response);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching classes:', error);
        throw new Error('Failed to fetch classes'); 
    }
};