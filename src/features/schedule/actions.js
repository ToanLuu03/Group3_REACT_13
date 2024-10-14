export const GET_SCHEDULE_REQUEST = "GET_SCHEDULE_REQUEST";
export const GET_SCHEDULE_SUCCESS = "GET_SCHEDULE_SUCCESS";
export const GET_SCHEDULE_FAILURE = "GET_SCHEDULE_FAILURE";

export const GET_SCHEDULE_DETAIL_REQUEST = "GET_SCHEDULE_DETAIL_REQUEST";
export const GET_SCHEDULE_DETAIL_SUCCESS = "GET_SCHEDULE_DETAIL_SUCCESS";
export const GET_SCHEDULE_DETAIL_FAILURE = "GET_SCHEDULE_DETAIL_FAILURE";

export const POST_FREE_TIME_REQUEST = "POST_FREE_TIME_REQUEST";
export const POST_FREE_TIME_SUCCESS = "POST_FREE_TIME_SUCCESS";
export const POST_FREE_TIME_FAILURE = "POST_FREE_TIME_FAILURE";

export const getScheduleRequest = (account) => ({
    type: GET_SCHEDULE_REQUEST,
    payload: { account },
});

export const getScheduleSuccess = (data) => ({
    type: GET_SCHEDULE_SUCCESS,
    payload: data,
});

export const getScheduleFailure = (error) => ({
    type: GET_SCHEDULE_FAILURE,
    payload: error,
});

export const getScheduleDetailRequest = (slotTimeIds) => ({
    type: GET_SCHEDULE_DETAIL_REQUEST,
    payload: { slotTimeIds },
});

export const getScheduleDetailSuccess = (data) => ({
    type: GET_SCHEDULE_DETAIL_SUCCESS,
    payload: data,
});

export const getScheduleDetailFailure = (error) => ({
    type: GET_SCHEDULE_DETAIL_FAILURE,
    payload: error,
});

export const postFreeTimeRequest = (data) => ({
    type: POST_FREE_TIME_REQUEST,
    payload: data,
});

export const postFreeTimeSuccess = () => ({
    type: POST_FREE_TIME_SUCCESS,
});

export const postFreeTimeFailure = (error) => ({
    type: POST_FREE_TIME_FAILURE,
    payload: error,
});
