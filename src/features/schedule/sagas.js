import { put, takeEvery } from 'redux-saga/effects';
import { FETCH_EVENTS, setEvents } from './actions';

function* fetchEventsSaga() {
    const schedules = [
        {
            id: 1,
            date: '2024-10-07',
            attendeeType: 'Fresher',
            startTime: '2024-10-07T08:00:00',
            endTime: '2024-10-07T11:00:00',
            isDeleted: false,
            topic: {
                topicId: 101,
                topicName: 'Redux-Saga'
            },
            moduleId: 1
        },
        {
            id: 2,
            date: '2024-10-08',
            attendeeType: 'Fresher',
            startTime: '2024-10-08T18:00:00',
            endTime: '2024-10-08T20:00:00',
            isDeleted: false,
            topic: {
                topicId: 102,
                topicName: 'Introduction'
            },
            moduleId: 2
        },
        {
            id: 3,
            date: '2024-10-09',
            attendeeType: 'Free Time',
            startTime: '2024-10-09T11:00:00',
            endTime: '2024-10-09T13:00:00',
            isDeleted: false,
            topic: {
                topicId: 103,
                topicName: 'Introduction'
            },
            moduleId: 0
        },
        {
            id: 4,
            date: '2024-10-09',
            attendeeType: 'Intern',
            startTime: '2024-10-09T14:00:00',
            endTime: '2024-10-09T20:00:00',
            isDeleted: false,
            topic: {
                topicId: 104,
                topicName: 'Introduction'
            },
            moduleId: 3
        }
    ];

    const details = [
        {
            Id: 1,
            Created_by: 'Zab Gi',
            Location_name: 'Room 3',
            Admin: 'Admin User'
        },
        {
            Id: 2,
            Created_by: 'Fer Da',
            Location_name: 'Room 2',
            Admin: 'Admin User'
        },
        {
            Id: 3,
            Created_by: 'John Sa',
            Location_name: 'Room 1',
            Admin: 'Admin User'
        },
    ];

    const events = schedules.map((schedule) => {
        const detail = details.find((d) => d.Id === schedule.moduleId) || {};
        return {
            ...schedule,
            ...detail,
        };
    });

    yield put(setEvents(Array.isArray(events) ? events : []));
}

export function* watchFetchEvents() {
    yield takeEvery(FETCH_EVENTS, fetchEventsSaga);
}


