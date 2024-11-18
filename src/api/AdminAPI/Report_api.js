import { instance } from '../instance'
const token = localStorage.getItem('token');

export const fetchClasses = async () => {
    try {
        const response = await instance.get('v1/trainers/trainer-report/get-schedule-non-report', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        throw new Error('Failed to fetch classes');
    }
};

export const fetchReport = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await instance.get('v1/trainers/reports-history', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        throw new Error('Failed to fetch report');
    }
};

export const fetchClassesAndModules = async () => {
    try {
        const response = await instance.get('v1/trainers/reports-history', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        throw new Error('Failed to fetch classes or modules');
    }
};

export const createReport = async (reportData) => {
    try {
        const response = await instance.post('v1/trainers/reports', reportData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        throw new Error('Failed to create report');
    }
};
