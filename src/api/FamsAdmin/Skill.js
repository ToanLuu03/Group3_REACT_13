import axios from 'axios';// hoặc
// const API_BASE = process.env.REACT_APP_API_URL; // Nếu dùng Create React App
import { instance } from '../instance'
export const fetchSkillAPI = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await instance.get(`v1/skills`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // console.log('Raw API response:', response);

        if (response && response.success) {
            // console.log('Processed API data:', response.data);
            const filteredData = response.data.filter(skill => skill.isDeleted === false);
            return { ...response, data: filteredData };
        }
        return [];
    } catch (error) {
        // console.error('Error in fetchSkillAPI:', error);
        throw error;
    }
};

const extractSkills = (data) => {
    return data.map(skill => ({
        id: skill?.id,
        skillName: skill?.skillName,
        skillType: skill?.skillType,
        levels: skill?.levels.map(level => ({
            levelId: level?.id,
            levelName: level?.name
        })),
        note: skill?.note,
        isdelete: skill?.isDeleted,
    }));
};

export const fetchSkilllAdd = async (skillData) => {
    const token = localStorage.getItem("token");
    try {
        const dataWithLevel = {
            ...skillData,
            levels: [1]
        };

        const response = await instance.post(
            `v1/skills`,
            dataWithLevel,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response && response.success) {
            // console.log('Skill added successfully:', response.data);
            return response;
        }
        throw new Error('Failed to add skill');
    } catch (error) {
        console.error('Error in fetchSkilllAdd:', error);
        throw error;
    }
};

export const fetchSkillById = async (id) => {
    const token = localStorage.getItem("token");
    try {
        const response = await instance.get(
            `v1/skills/${id}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response && response.success) {
            // console.log('Skill fetched successfully:', response.data);
            return response;
        }
        throw new Error('Failed to fetch skill');
    } catch (error) {
        console.error('Error in fetchSkillById:', error);
        throw error;
    }
};

export const fetchSkillUpdateById = async (id, updateData) => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error('Authentication token not found');
    }

    try {
        // Đảm bảo dữ liệu gửi đi đúng format
        const formattedData = {
            skillName: updateData.skillName?.trim(),
            note: updateData.note?.trim(),
            levels: updateData.levels || [1]
        };

        // console.log('Sending update data:', formattedData);

        const response = await instance.put(
            `v1/skills/${id}`,
            formattedData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response && response.success) {
            // console.log('Skill updated successfully:', response.data);
            return response;
        }

        throw new Error(response?.message || 'Failed to update skill');
    } catch (error) {
        // console.error('Error in fetchSkillUpdateById:', {
        //     id,
        //     error: error.response?.data || error.message
        // });
        throw error;
    }
};


export const fetchSkillDeleteById = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error('Authentication token not found');
    }

    try {
        const response = await instance.delete(
            `v1/skills/${id}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response && response.success) {
            // console.log('Skill deleted successfully:', response.data);
            return response;
        }

        throw new Error(response?.message || 'Failed to delete skill');
    } catch (error) {
        console.error('Error in fetchSkillDeleteById:', {
            id,
            error: error.response?.data || error.message
        });
        throw error.response || error;
    }
};