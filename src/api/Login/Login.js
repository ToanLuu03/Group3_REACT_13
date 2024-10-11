import axios from 'axios';

export const login = async (username, password) => {
    try {
        const response = await axios.post('https://fams-test.fa.edu.vn/api/login', {
            username,
            password
        });
        localStorage.setItem('token', response.data.accessToken);
        return response.data.roles;
    } catch (error) {
        console.error('Error logging in:', error);
        throw new Error('Failed to log in');
    }
};