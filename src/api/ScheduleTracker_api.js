import axios from 'axios';

export const fetchDataTrainer = async () => {
    const URLTrainer = 'https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/admin/schedule-tracker?option=TRAINER';
    const token = localStorage.getItem('token');

    try {
        const trainer = await axios.get(URLTrainer, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (trainer?.data?.data) {
            const extractedData = extractContents(trainer.data);
            return extractedData;
        } else {
            console.warn('No data found in trainer response');
            return [];
        }
    } catch (error) {
        console.error('Error fetching trainer data:', error.response?.data || error.message);
        return [];
    }
};

export const fetchDataClass = async () => {
    const URLClass = 'https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/admin/schedule-tracker?option=CLASS';
    const token = localStorage.getItem('token');

    try {
        if (!token) {
            console.warn('Authorization token is not set.');
            return [];
        }
        const Classdata = await axios.get(URLClass, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (Classdata && Classdata.data) {
            if (Array.isArray(Classdata.data.data)) {
                const extractedData = extractClassData(Classdata.data.data);
                return extractedData;
            }
        } else {
            console.warn('No data found in class response:', Classdata);
            return [];
        }
    } catch (error) {
        console.error('Error fetching class data:', error.response?.data || error.message);
        return [];
    }
};

export const fetchDataClassAdmin = async () => {
    const URLClassAdmin = 'https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/admin/schedule-tracker?option=CLASS_ADMIN';
    const token = localStorage.getItem('token');

    try {
        if (!token) {
            console.warn('Authorization token is not set.');
            return [];
        }
        const Classdata = await axios.get(URLClassAdmin, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (Classdata && Classdata.data) {
            if (Array.isArray(Classdata.data.data)) {
                const extractedData = extractClassAdmin(Classdata.data.data);
                return extractedData;
            }
        } else {
            console.warn('No data found in class admin response:', Classdata);
            return [];
        }
    } catch (error) {
        console.error('Error fetching class admin data:', error.response?.data || error.message);
        return [];
    }
};

// Extrac
export const fetchDataLog = async (classId, moduleId) => {
    const URLLog = `https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v3/logs?classId=${classId}&moduleId=${moduleId}`;
    const token = localStorage.getItem('token');

    try {
        if (!token) {
            console.warn('Authorization token is not set.');
            return [];
        }

        if (!classId || !moduleId) {
            console.warn('ClassId and ModuleId are required parameters');
            return [];
        }

        const response = await axios.get(URLLog, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Return empty array if no data found
        if (response?.data?.success && !response?.data?.data?.length) {
            return [];
        }

        return response?.data?.data || [];
    } catch (error) {
        console.error('Error fetching logs:', error.response?.data || error.message);
        return [];
    }
};

export const fetchClasses = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/admin/schedule-tracker?option=CLASS', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Extract unique classes from the response
        const classes = response?.data?.data || [];
        const uniqueClasses = [...new Set(classes.map(item => ({
            id: item.classId,
            className: item.className
        })))];

        return uniqueClasses;
    } catch (error) {
        console.error('Error fetching classes:', error);
        return [];
    }
};

export const fetchModules = async (classId) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/admin/schedule-tracker?option=CLASS', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Filter modules for the selected class
        const classData = response?.data?.data || [];
        const selectedClass = classData.find(item => item.classId === classId);
        const modules = selectedClass?.modules || [];

        return modules.map(module => ({
            id: module.moduleId,
            moduleName: module.moduleName
        }));
    } catch (error) {
        console.error('Error fetching modules:', error);
        return [];
    }
};

const extractClassAdmin = (ClassAdminData) => {
    if (!ClassAdminData || !Array.isArray(ClassAdminData)) {
        console.warn('Invalid ClassAdminData:', ClassAdminData);
        return [];
    }

    return ClassAdminData.flatMap(trainer => {
        if (!trainer) return [];

        // Kiểm tra và lấy trainerId
        const trainerId = trainer?.trainerId || trainer?.classAdmin || null;

        // Kiểm tra classes tồn tại
        if (!trainer.classes || !Array.isArray(trainer.classes)) return [];

        return trainer.classes.flatMap(classItem => {
            if (!classItem) return [];

            // Kiểm tra modules tồn tại
            if (!classItem.modules || !Array.isArray(classItem.modules)) return [];

            return classItem.modules.flatMap(moduleItem => {
                if (!moduleItem) return [];

                // Kiểm tra contents tồn tại
                if (!moduleItem.contents || !Array.isArray(moduleItem.contents)) return [];

                return moduleItem.contents.map(content => ({
                    trainerId: trainerId,
                    className: classItem?.className || '',
                    classId: classItem?.classId || '',
                    moduleName: moduleItem?.moduleName || '',
                    moduleId: moduleItem?.moduleId || '',
                    startDate: moduleItem?.startDate || null,
                    endDate: moduleItem?.endDate || null,
                    topicName: content?.topicName || '',
                    contentName: content?.contentName || '',
                    topicId: content?.topicId || '',
                    contentIsDone: content?.contentIsDone || false,
                    contentDeliveryType: content?.contentDeliveryType || '',
                    contentTrainingFormat: content?.contentTrainingFormat || '',
                    contentPlannedDate: content?.contentPlannedDate || null,
                    topicPlannedDate: content?.topicPlannedDate || null,
                    reportActualDate: content?.reportActualDate || null,
                    reportDuration: content?.reportDuration || '',
                    reportNote: content?.reportNote || '',
                    reportReason: content?.reportReason || '',
                }));
            });
        });
    });
};

const extractContents = (trainerData) => {
    if (!trainerData?.data || !Array.isArray(trainerData.data)) {
        console.warn('Invalid trainerData:', trainerData);
        return [];
    }

    return trainerData.data.flatMap(trainer => {
        if (!trainer) return [];

        // Kiểm tra classes tồn tại
        if (!trainer.classes || !Array.isArray(trainer.classes)) return [];

        return trainer.classes.flatMap(classItem => {
            if (!classItem) return [];

            // Kiểm tra modules tồn tại
            if (!classItem.modules || !Array.isArray(classItem.modules)) return [];

            return classItem.modules.flatMap(moduleItem => {
                if (!moduleItem) return [];

                // Kiểm tra contents tồn tại
                if (!moduleItem.contents || !Array.isArray(moduleItem.contents)) return [];

                return moduleItem.contents.map(content => ({
                    trainerId: trainer?.trainerId || '',
                    className: classItem?.className || '',
                    classId: classItem?.classId || '',
                    moduleName: moduleItem?.moduleName || '',
                    moduleId: moduleItem?.moduleId || '',
                    startDate: moduleItem?.startDate || null,
                    endDate: moduleItem?.endDate || null,
                    topicName: content?.topicName || '',
                    contentName: content?.contentName || '',
                    topicId: content?.topicId || '',
                    contentIsDone: content?.contentIsDone || false,
                    contentDeliveryType: content?.contentDeliveryType || '',
                    contentTrainingFormat: content?.contentTrainingFormat || '',
                    contentPlannedDate: content?.contentPlannedDate || null,
                    topicPlannedDate: content?.topicPlannedDate || null,
                    reportActualDate: content?.reportActualDate || null,
                    reportDuration: content?.reportDuration || '',
                    reportNote: content?.reportNote || '',
                    reportReason: content?.reportReason || '',
                }));
            });
        });
    });
};

const extractClassData = (classData) => {
    if (!classData || !Array.isArray(classData)) {
        console.warn('Invalid classData:', classData);
        return [];
    }

    return classData.flatMap(classItem => {
        if (!classItem) return [];

        // Kiểm tra modules tồn tại
        if (!classItem.modules || !Array.isArray(classItem.modules)) return [];

        return classItem.modules.flatMap(moduleItem => {
            if (!moduleItem) return [];

            // Kiểm tra contents tồn tại
            if (!moduleItem.contents || !Array.isArray(moduleItem.contents)) return [];

            return moduleItem.contents.map(content => ({
                trainerId: moduleItem?.trainerId || '',
                className: classItem?.className || '',
                classId: classItem?.classId || '',
                moduleName: moduleItem?.moduleName || '',
                moduleId: moduleItem?.moduleId || '',
                startDate: moduleItem?.startDate || null,
                endDate: moduleItem?.endDate || null,
                topicName: content?.topicName || '',
                contentName: content?.contentName || '',
                topicId: content?.topicId || '',
                contentIsDone: content?.contentIsDone || false,
                contentDeliveryType: content?.contentDeliveryType || '',
                contentTrainingFormat: content?.contentTrainingFormat || '',
                contentPlannedDate: content?.contentPlannedDate || null,
                topicPlannedDate: content?.topicPlannedDate || null,
                reportActualDate: content?.reportActualDate || null,
                reportDuration: content?.reportDuration || '',
                reportNote: content?.reportNote || '',
                reportReason: content?.reportReason || '',
            }));
        });
    });
};
