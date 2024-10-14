import {
    GET_SCHEDULE_DETAIL_REQUEST,
    GET_SCHEDULE_DETAIL_SUCCESS,
    GET_SCHEDULE_DETAIL_FAILURE,
} from "./actions";

const initialState = {
    scheduleDetail: [],
    loading: false,
    error: null,
};

const scheduleDetailReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SCHEDULE_DETAIL_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_SCHEDULE_DETAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                scheduleDetail: action.payload
            };
        case GET_SCHEDULE_DETAIL_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default scheduleDetailReducer;
