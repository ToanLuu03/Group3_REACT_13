import axios from 'axios';


export const fetchDataTrainer = async () => {
    const URLTrainer = 'https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/admin/schedule-tracker?option=TRAINER';
    const token = localStorage.getItem('token');

    try {
        const trainer = await axios.get(URLTrainer, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Trainer', trainer)
        if (trainer?.data?.data) {
            const extractedData = extractContents(trainer.data);
            return extractedData;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error fetching trainer data:', error.trainer?.data || error.message, error);
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
                Authorization: `Bearer ${token}`
            }
        });

        console.log('API Response:', Classdata);
        if (Classdata && Classdata.data) {
            console.log('Classdata structure:', Classdata.data);
            if (Array.isArray(Classdata.data.data)) {
                const extractedData = extractClassData(Classdata.data.data);
                return extractedData;
            }
        } else {
            console.warn('No data found in response:', Classdata);
            return [];
        }
    } catch (error) {
        console.error('Error fetching class data:', error.response?.data || error.message);
    }
};


const extractContents = (trainerData) => {
    return trainerData?.data?.flatMap(trainer => {
        return trainer?.classes?.flatMap(classItem => {
            return classItem?.modules?.flatMap(moduleItem => {
                return moduleItem?.contents?.map(content => ({
                    trainerId: trainer?.trainerId,
                    className: classItem?.className,
                    classId: classItem?.classId,
                    moduleName: moduleItem?.moduleName,
                    endDate: moduleItem.endDate,
                    startDate: moduleItem.endDate,
                    moduleId: moduleItem?.moduleId,
                    startDate: moduleItem?.startDate,
                    endDate: moduleItem?.endDate,
                    topicName: content?.topicName,
                    contentName: content?.contentName,
                    topicId: content?.topicId,
                    contentIsDone: content?.contentIsDone,
                    contentDeliveryType: content?.contentDeliveryType,
                    contentTrainingFormat: content?.contentTrainingFormat,
                    contentPlannedDate: content?.contentPlannedDate,
                    topicPlannedDate: content?.topicPlannedDate,
                    reportActualDate: content?.reportActualDate,
                    reportDuration: content?.reportDuration,
                    reportNote: content?.reportNote,
                    reportReason: content?.reportReason,
                }));
            }) || [];
        }) || [];
    }) || [];
};
const extractClassData = (classData) => {
    return classData?.flatMap(classItem => {
        return classItem?.modules?.flatMap(moduleItem => {
            return moduleItem?.contents?.map(content => ({
                trainerId: moduleItem.trainerId,
                className: classItem.className,
                classId: classItem.classId,
                moduleName: moduleItem.moduleName,
                endDate: moduleItem.endDate,
                startDate: moduleItem.endDate,
                moduleId: moduleItem.moduleId,
                contentIsDone: content?.contentIsDone,
                startDate: moduleItem.startDate,
                endDate: moduleItem.endDate,
                topicName: content?.topicName,
                contentName: content?.contentName,
                topicId: content?.topicId,
                contentDeliveryType: content?.contentDeliveryType,
                contentTrainingFormat: content?.contentTrainingFormat,
                contentPlannedDate: content?.contentPlannedDate,
                topicPlannedDate: content?.topicPlannedDate,
                reportActualDate: content?.reportActualDate,
                reportDuration: content?.reportDuration,
                reportNote: content?.reportNote,
                reportReason: content?.reportReason,
            })) || [];
        }) || [];
    }) || [];
};

// fetchDataClass().then(trainerData => {
//     const extractedContent = extractContents(trainerData);
//     console.log(extractedContent);
// });