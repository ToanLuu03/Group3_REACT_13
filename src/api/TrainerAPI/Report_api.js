import axios from 'axios';


export const fetchClasses = async () => {
    try {
        const token = localStorage.getItem('token');

        const response = await axios.get('https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/trainers/trainer-report/get-schedule-non-report', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Response: ', response)
        return response;
    } catch (error) {
        console.error('Error fetching classes:', error);
        throw new Error('Failed to fetch classes');
    }
};

export const fetchReport = async () => {
    try {
        const token = localStorage.getItem('token');

        const response = await axios.get('https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/trainers/reports-history', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching report:', error);
        throw new Error('Failed to fetch report');
    }
};

export const createReport = async (reportData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/trainers/reports', reportData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        // console.error('Error creating report:', error);
        throw error;
    }
};
