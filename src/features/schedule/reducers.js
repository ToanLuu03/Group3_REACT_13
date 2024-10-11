import { SET_EVENTS, UPDATE_EVENT, ADD_EVENT, DELETE_EVENT } from './actions';

const initialState = {
    events: []
};

const eventReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_EVENTS:
            return {
                ...state,
                events: action.events || []
            };
        case UPDATE_EVENT:
            const updatedEvent = action.payload;
            return {
                ...state,
                events: state.events.map((event) =>
                    event.id === updatedEvent.id ? updatedEvent : event
                ),
            };
        case ADD_EVENT:
            return {
                ...state,
                events: [...state.events, action.payload],
            };
        case DELETE_EVENT:
            return {
                ...state,
                events: state.events.filter(event => event.id !== action.payload),
            };
        default:
            return state;
    }
};

export default eventReducer;
