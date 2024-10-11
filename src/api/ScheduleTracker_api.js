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
        const Class = await axios.get(URLClass, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        // console.log('API Response:', response);

        if (Class?.data?.data) {
            const extractedData = extractClassData(Class.data.data);
            return extractedData;
        } else {
            console.warn('No data found in response:', Class.data);
            return [];
        }
    } catch (error) {
        console.error('Error fetching class data:', error.Class?.data || error.message);
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
                    topicId:content?.topicId,
                    contentDeliveryType: content?.contentDeliveryType,
                    contentTrainingFormat: content?.contentTrainingFormat,
                    contentPlannedDate: content?.contentPlannedDate,
                    reportActualDate: content?.reportActualDate,
                    reportDuration: content?.reportDuration,
                    reportNote: content?.reportNote,
                    reportReason: content?.reportReason
                }));
            }) || [];
        }) || [];
    }) || [];
};


const extractClassData = (classData) => {
    return classData?.flatMap(classItem => {
        return classItem?.modulesList?.flatMap(moduleItem => {
            return moduleItem?.contentList?.map(content => ({
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
                topicId:content?.topicId,
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

// fetchDataCLASS().then(trainerData => {
//     const extractedContent = extractContents(trainerData);
//     console.log(extractedContent);
// });