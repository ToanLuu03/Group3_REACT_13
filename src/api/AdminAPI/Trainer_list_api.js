import axios from 'axios';

// Fetch token from localStorage
export const fetchClasses = async (token) => {
    try {
        const response = await axios.get(
            'http://fams-app.ap-southeast-2.elasticbeanstalk.com/api/v1/trainer/get-all',
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