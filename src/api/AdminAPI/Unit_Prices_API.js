import axios from 'axios';

const token = localStorage.getItem('token');

export const fetchTrainerUnitPrices = async (account) => {
    try {
        const response = await axios.get(
            `https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/trainer/get-info/${account}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        console.log('Response from API:', response.data); // Log dữ liệu trả về để kiểm tra
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error('Error fetching trainer unit prices:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch trainer unit prices');
    }
};



export const updateTrainerUnitPrices = async (trainerUnitPriceList) => {
    try {
        const response = await axios.post(
            'https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/trainer/unit-price/update',  // Endpoint mới
            {
                trainerUnitPriceList: trainerUnitPriceList,  // Dữ liệu truyền lên server
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('Response from API:', response.data); // Log phản hồi từ API để kiểm tra
        return response.data;
    } catch (error) {
        console.error('Error updating trainer unit prices:', error.response ? error.response.data : error.message);
        throw new Error('Failed to update trainer unit prices');
    }
};