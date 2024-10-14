import {
    GET_SCHEDULE_REQUEST,
    GET_SCHEDULE_SUCCESS,
    GET_SCHEDULE_FAILURE,
} from "./actions";

const initialState = {
    schedule: [],
    loading: false,
    error: null,
};

const scheduleReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SCHEDULE_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_SCHEDULE_SUCCESS:
            return { ...state, loading: false, schedule: action.payload };
        case GET_SCHEDULE_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default scheduleReducer;
