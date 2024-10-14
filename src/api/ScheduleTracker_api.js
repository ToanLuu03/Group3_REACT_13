import axios from 'axios';


const token = localStorage.getItem('token');
export const fetchDataTrainer = async () => {
    const URLTrainer = 'https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/admin/schedule-tracker?option=TRAINER';

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
    }
};


export const fetchDataClass = async () => {
    const URLClass = 'https://fams-eqdedeekc2grgxa2.australiaeast-01.azurewebsites.net/api/v1/admin/schedule-tracker?option=CLASS';

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

        console.log('API Response:', Classdata); // Log the entire response

        // Check if Classdata is structured as expected
        if (Classdata && Classdata.data) {
            console.log('Classdata structure:', Classdata.data); // Log the structure of Classdata.data
            
            // Check if Classdata.data.data exists and is an array
            if (Array.isArray(Classdata.data.data)) {
                const extractedData = extractClassData(Classdata.data.data); // Ensure you pass the correct path
                return extractedData;
            } else {
                console.warn('No data array found in response:', Classdata.data);
                return [];
            }
        } else {
            console.warn('No data found in response:', Classdata);
            return [];
        }
    } catch (error) {
        // Log the error response if available
        console.error('Error fetching class data:', error.response?.data || error.message);
        return [];
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
                reportActualDate: content?.reportActualDate,
                reportDuration: content?.reportDuration,
                reportNote: content?.reportNote,
                reportReason: content?.reportReason,
            })) || [];
        }) || [];
    }) || [];
};

fetchDataClass().then(trainerData => {
    const extractedContent = extractContents(trainerData);
    console.log(extractedContent);
});