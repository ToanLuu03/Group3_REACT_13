import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  gpaData: [],
  feedbackData: [],
  loading: false,
  error: null,
};

const portalSlice = createSlice({
  name: 'portal',
  initialState,
  reducers: {
    fetchGpaDataStart: (state) => {
      state.loading = true;
    },
    fetchGpaDataSuccess: (state, action) => {
      state.gpaData = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchGpaDataFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchFeedbackDataStart: (state) => {
      state.loading = true;
    },
    fetchFeedbackDataSuccess: (state, action) => {
      state.feedbackData = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchFeedbackDataFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchGpaDataStart,
  fetchGpaDataSuccess,
  fetchGpaDataFailure,
  fetchFeedbackDataStart,
  fetchFeedbackDataSuccess,
  fetchFeedbackDataFailure,
} = portalSlice.actions;

export const portalReducer = portalSlice.reducer;