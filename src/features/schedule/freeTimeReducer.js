import {
    POST_FREE_TIME_REQUEST,
    POST_FREE_TIME_SUCCESS,
    POST_FREE_TIME_FAILURE,
    RESET_POST_FREE_TIME_SUCCESS,
    GET_FREE_TIME_REQUEST,
    GET_FREE_TIME_SUCCESS,
    GET_FREE_TIME_FAILURE,
} from "./actions";

const initialState = {
    freeTime: [],
    loading: false,
    error: null,
    postFreeTimeSuccess: false,
};

const freeTimeReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_FREE_TIME_REQUEST:
            return { ...state, loading: true, postFreeTimeSuccess: false, error: null };
        case POST_FREE_TIME_SUCCESS:
            return { ...state, loading: false, postFreeTimeSuccess: true };
        case POST_FREE_TIME_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case RESET_POST_FREE_TIME_SUCCESS:
            return { ...state, postFreeTimeSuccess: false };
        case GET_FREE_TIME_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_FREE_TIME_SUCCESS:
            return { ...state, loading: false, freeTime: action.payload };
        case GET_FREE_TIME_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default freeTimeReducer;
