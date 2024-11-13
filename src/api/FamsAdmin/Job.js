import axios from 'axios';

export const fetchJobs = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get('https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/jobs',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const result = response.data;
        if (result.success) {
            return result.data.filter(job => job.deleted === false);
        } else {
            console.error('Failed to fetch jobs:', result.message);
            return [];
        }
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return [];
    }
};

export const deleteJob = async (id) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/jobs/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log('Job deleted successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error deleting job:', error);
        throw error;
    }
};

export const fetchRoles = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get('https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/jobs',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        ); // Replace with your API URL
        if (response.data.success) {
            const roles = response.data.data
                .filter((job) => job.deleted === false)
                .map((job) => job.role); // Get the roles

            // Remove duplicates using a Set
            const uniqueRoles = [...new Set(roles)];
            return uniqueRoles;
        }
        return [];
    } catch (error) {
        console.error('Error fetching roles:', error);
        return []; // Return empty array in case of error
    }
};


export const addRole = async (role, note, levels, deleted) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
            'https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/jobs',
            {
                role,
                note,
                levels,
                deleted,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error adding role:', error);
        throw error;
    }
};

export const fetchJobById = async (id) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/jobs/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể lấy chi tiết công việc');
    }
};
export const updateJob = async (id, updatedData) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.put(
            `https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/jobs/${id}`,  // Đúng endpoint
            updatedData,  // Truyền trực tiếp dữ liệu cần cập nhật
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Cập nhật công việc thất bại');
    }
};
