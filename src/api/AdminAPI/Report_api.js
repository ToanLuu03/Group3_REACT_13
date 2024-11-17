import axios from 'axios';

const token = localStorage.getItem('token');

export const fetchClasses = async () => {
    try {
        const response = await axios.get('http://fams-app.ap-southeast-2.elasticbeanstalk.com/api/v1/trainers/trainer-report/get-schedule-non-report', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Response: ',response)
        return response;
    } catch (error) {
        console.error('Error fetching classes:', error);
        throw new Error('Failed to fetch classes');
    }
};

export const fetchReport = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('http://fams-app.ap-southeast-2.elasticbeanstalk.com/api/v1/trainers/reports-history', {
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

export const fetchClassesAndModules = async () => {
    try {
        const response = await axios.get('http://fams-app.ap-southeast-2.elasticbeanstalk.com/api/v1/trainers/reports-history', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Trả về dữ liệu gốc từ API
    } catch (error) {
        console.error('Error fetching classes or modules:', error);
        throw new Error('Failed to fetch classes or modules');
    }
};

export const createReport = async (reportData) => {
    try {
        const response = await axios.post('http://fams-app.ap-southeast-2.elasticbeanstalk.com/api/v1/trainers/reports', reportData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating report:', error);
        throw new Error('Failed to create report');
    }
};
