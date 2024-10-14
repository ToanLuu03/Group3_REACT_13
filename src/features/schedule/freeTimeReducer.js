import {
    POST_FREE_TIME_REQUEST,
    POST_FREE_TIME_SUCCESS,
    POST_FREE_TIME_FAILURE,
} from "./actions";

const initialState = {
    schedule: [],
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
            return { ...state, loading: false, error: action.payload, postFreeTimeSuccess: false };
        default:
            return state;
    }
};

export default freeTimeReducer;
