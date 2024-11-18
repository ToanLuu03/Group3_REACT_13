import axios from 'axios';
import { instance } from '../instance';
const token = localStorage.getItem('token');

export const fetchConfig = async () => {

    try {
        const response = await instance.get('v3/config-effort/get-all', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.error('Error fetching :', error);
        throw new Error('Failed to fetch classlist');
    }
};
export const createConfig = async (configDataArray) => {
    try {
        // Ensure we're sending an array of objects with the exact structure
        const cleanedData = configDataArray.map(item => ({
            "id": Number(item.id),
            "deadline": String(item.deadline),
            "time": String(item.time),
            "description": String(item.description)
        }));

        // console.log('Final API payload:', JSON.stringify(cleanedData, null, 2));

        const response = await instance.post(
            'v3/config-effort',
            cleanedData, // Send the array directly
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response;

    } catch (error) {
        // console.error('API Error Response:', error.response);
        throw error;
    }
};