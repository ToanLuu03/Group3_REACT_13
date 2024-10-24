// actions.js
export const FETCH_FEEDBACK_REQUEST = 'FETCH_FEEDBACK_REQUEST';
export const FETCH_FEEDBACK_SUCCESS = 'FETCH_FEEDBACK_SUCCESS';
export const FETCH_FEEDBACK_FAILURE = 'FETCH_FEEDBACK_FAILURE';

export const SET_SELECTED_METRICS = 'SET_SELECTED_METRICS';
export const SET_SELECTED_CLASS = 'SET_SELECTED_CLASS';

// Action creators
export const fetchFeedbackRequest = () => ({
  type: FETCH_FEEDBACK_REQUEST,
});

export const fetchFeedbackSuccess = (feedbackData) => ({
  type: FETCH_FEEDBACK_SUCCESS,
  payload: feedbackData,
});

export const fetchFeedbackFailure = (error) => ({
  type: FETCH_FEEDBACK_FAILURE,
  payload: error,
});

export const setSelectedMetrics = (metrics) => ({
  type: SET_SELECTED_METRICS,
  payload: metrics,
});

export const setSelectedClass = (className) => ({
  type: SET_SELECTED_CLASS,
  payload: className,
});
