import { instance } from '../instance'

export const fetchTrainerInfo = async (account, token) => {
    try {
        const response = await instance.get(`v1/trainer/get-info/${account}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response?.data?.trainerInfo?.generalInfo) {
            return response.data.data.trainerInfo;
        } else {
            throw new Error('Trainer info is missing from the API response');
        }
    } catch (error) {
        throw new Error('Failed to fetch trainer info');
    }
};

export const updateTrainerInfo = async (account, updatedData, token) => {
    try {
        const response = await instance.put(
            `v1/trainer/update-trainer/${account}`,
            updatedData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response;
    } catch (error) {
        throw new Error('Failed to update trainer info');
    }
};

export const fetchMasterData = async (token) => {
    try {
        const response = await instance.get(
            `v2/trainer/master-data`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchTrainerInfoV2 = async (account, token) => {
    try {
        const response = await instance.get(`v2/trainer/get-info-v2/${account}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.trainerInfo;
    } catch (error) {
        throw error;
    }
};

export const updateTrainerInfoV2 = async (account, updatedData, token) => {
    try {
        const response = await instance.put(
            `v2/trainer/update-trainer/${account}`,
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
        throw error;
    }
};

export const uploadAvatar = async (file, token) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await instance.post(
            `v1/images`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                    Accept: "*/*",
                },
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteCertificate = async (certificateId, token) => {
    try {
        const response = await instance.delete(
            `v1/certificate/delete/${certificateId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response;
    } catch (error) {
        throw new Error('Failed to delete certificate');
    }
};
