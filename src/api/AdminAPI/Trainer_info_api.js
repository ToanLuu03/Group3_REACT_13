import axios from 'axios';

export const fetchTrainerInfo = async (account, token) => {
    try {
        const response = await axios.get(`https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/trainer/get-info/${account}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

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

export const updateTrainerInfo = async (account, updatedData, token) => {
    try {
        const response = await axios.put(
            `https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/trainer/update-trainer/${account}`,
            updatedData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error updating trainer info:', error.message);
        throw new Error('Failed to update trainer info');
    }
};

export const fetchMasterData = async (token) => {
    try {
        const response = await axios.get(
            `https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v2/trainer/master-data`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.data;
    } catch (error) {
        // console.error('Error fetch master data:', error.message);
        throw error;
    }
};

export const fetchTrainerInfoV2 = async (account, token) => {
    try {
        const response = await axios.get(`https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v2/trainer/get-info-v2/${account}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.data.trainerInfo;
    } catch (error) {
        // console.error('Error fetching trainer info:', error.message);
        throw error;
    }
};

export const updateTrainerInfoV2 = async (account, updatedData, token) => {
    try {
        const response = await axios.put(
            `https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v2/trainer/update-trainer/${account}`,
            updatedData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data;
    } catch (error) {
        // console.error('Error updating trainer info:', error.message);
        throw error;
    }
};

export const uploadAvatar = async (file, token) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await axios.post(
            `https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/images`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                    Accept: "*/*",
                },
            }
        );
        return response.data;
    } catch (error) {
        // console.error("Error uploading avatar:", error.response ? error.response.data : error.message);
        throw error;
    }
};