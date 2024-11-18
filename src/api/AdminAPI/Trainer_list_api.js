import { instance } from '../instance'
// Fetch token from localStorage
export const fetchClasses = async (token) => {
    try {
        const response = await instance.get(
            'v1/trainer/get-all',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch classes'); 
    }
};