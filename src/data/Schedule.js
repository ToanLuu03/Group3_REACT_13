


export const options = [
    { label: 'Class Name', value: 'Class Name' },
    { label: 'Trainer', value: 'Trainer' },
];

export const classOptions = [
    { label: 'Class 1', value: 'Name1' },
    { label: 'Class 2', value: 'Name2' },
];

export const trainerOptions = [
    { label: 'Trainer 1', value: 'Trainer1' },
    { label: 'Trainer 2', value: 'Trainer2' },
];

export const moduleOptions = [
    { label: 'Module 1', value: 'Module1' },
    { label: 'Module 2', value: 'Module2' },
];

export const deliveryOptions = [
    { label: 'Select All', value: 'Select All' },
    { label: 'Assignment/Lab', value: 'Assignment/Lab' },
    { label: 'Concept/Lecture', value: 'Concept/Lecture' },
    { label: 'Test/Quiz', value: 'Test/Quiz' },
];

export const statusOptions = [
    { label: 'Select All', value: 'Select All' },
    { label: 'Reported', value: 'Reported' },
    { label: 'Mismatch', value: 'Mismatch' },
    { label: 'On Going', value: 'On Going' },
];

export const trainingFormatOptions = [
    { label: 'Select All', value: 'Select All' },
    { label: 'Online', value: 'Online' },
    { label: 'Offline', value: 'Offline' },
    { label: 'Homework', value: 'Homework' },
];

// Sample data for the table
export const sampleTableData = [
    {
        key: '1',
        trainerId: 'VinhNH37',
        deliveryType: 'Test/Quiz',
        trainingFormat: 'Offline',
        status: 'Reported',
        scheduledDate: '2024-09-05',
        actualStartDate: '2024-09-07',
    },
    {
        key: '2',
        trainerId: 'VinhNH37',
        deliveryType: 'Assignment/Lab',
        trainingFormat: 'Online',
        status: 'Reported',
        scheduledDate: '2024-09-08',
        actualStartDate: '2024-09-09',
    },
    // More rows...
];

export const columns = [
    { title: 'TrainerId', dataIndex: 'trainerId', key: 'trainerId' },
    { title: 'Delivery Type', dataIndex: 'deliveryType', key: 'deliveryType' },
    { title: 'Training Format', dataIndex: 'trainingFormat', key: 'trainingFormat' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Scheduled Date', dataIndex: 'scheduledDate', key: 'scheduledDate' },
    { title: 'Actual Start Date', dataIndex: 'actualStartDate', key: 'actualStartDate' },
];

export const combinedTableData = [
    {
        Schedule: 'JS 1',
        Topic: ['Overview 1', 'Overview 2', 'Overview 3'],
        TrainerId: 'VinhNH37',
        Delivery: [
            {
                name: 'Test/Quiz',
                status: 'Offline',
                report: 'Reported',
                scheduledDate: '2024-09-05',
                actualDate: '1996-12-22',
                duration: 2,
                note: 'OK',
                reasonForMismatch: 'none',
            },
            {
                name: 'Assignment/Lab',
                status: 'Offline',
                report: 'Reported',
                scheduledDate: '2024-09-05',
                actualDate: '1996-12-22',
                duration: 2,
                note: 'OK',
                reasonForMismatch: 'none',
            },
            {
                name: 'Test/Quiz',
                status: 'Offline',
                report: 'Reported',
                scheduledDate: '2024-09-05',
                actualDate: '2024-09-07',
                duration: 11,
                note: 'Good',
                reasonForMismatch: 'Teach sooner, No reason',
            },
        ],
    },

    {
        Schedule: 'JS 2',
        Topic: ['Overview 4', 'Overview 5'],
        TrainerId: 'VinhNH37',
        Delivery: [
            {
                name: 'Test/Quiz', 
                status: 'Offline', 
                report: 'Reported',
                scheduledDate: '2024-09-07',
                actualDate: '2024-09-07',
                duration: 11,
                note: 'Good',
                reasonForMismatch: 'Teach sooner, No reason',
            },
            {
                name: 'Test/Quiz', 
                status: 'Offline', 
                report: 'Reported',
                scheduledDate: '2024-09-07',
                actualDate: '2024-09-07',
                duration: 11,
                note: 'Good',
                reasonForMismatch: 'Teach sooner, No reason',
            },
        ],
    },
    {
        Schedule: 'JS 3',
        Topic: ['Overview 6','Overview 7', 'Overview 8'],
        TrainerId: 'VinhNH37',
        Delivery: [
            { name: 'Concept/Lecture', status: 'Offline', report: 'Reported',
                scheduledDate: '2024-09-08',
                actualDate: '2024-09-07',
                duration: 11,
                note: 'Good',
                reasonForMismatch: 'Teach sooner, No reason',
             },
            
            
            { name: 'Text/Quiz', 
                status: 'Online', 
                report: 'Reported',        
                scheduledDate: '2024-09-08',
                actualDate: '2024-09-09',
                duration: 6,
                note: 'Nice',
                reasonForMismatch: 'Not nice',
             },
            { name: 'Concept/Lecture', 
                status: 'Homework', 
                report: 'Reported',
                scheduledDate: '2024-09-08',
                actualDate: '2024-09-09',
                duration: 6,
                note: 'Nice',
                reasonForMismatch: 'Not nice',
             },
        ],
    },
    // Add more course data here
];