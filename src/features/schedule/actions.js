export const FETCH_EVENTS = 'FETCH_EVENTS';
export const SET_EVENTS = 'SET_EVENTS';
export const UPDATE_EVENT = 'UPDATE_EVENT'
export const ADD_EVENT = 'ADD_EVENT';
export const DELETE_EVENT = 'DELETE_EVENT';

export const fetchEvents = () => ({
    type: FETCH_EVENTS
});

export const setEvents = (events) => ({
    type: SET_EVENTS,
    events
});

export const updateEvent = (updatedEvent) => {
    return {
        type: UPDATE_EVENT,
        payload: updatedEvent,
    };
};

export const addEvent = (newEvent) => {
    return {
        type: ADD_EVENT,
        payload: newEvent,
    };
};

export const deleteEvent = (eventId) => {
    return {
        type: DELETE_EVENT,
        payload: eventId,
    };
};
