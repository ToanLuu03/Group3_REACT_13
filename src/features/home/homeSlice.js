import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  questions: {},
  loading: false,
  errorMessage: null,
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    handleGetQuestions(state, _action) {
      state.loading = true;
    },
    handleGetQuestionsSuccess(state, action) {
      state.loading = false;
      state.questions = action.payload.questions;
    },
    handleGetQuestionsFailure(state, action) {
      state.loading = false;
      state.questions = initialState.questions;
    },
    resetErrorMessage(state) {
      state.errorMessage = initialState.errorMessage;
    },
  },
});

const { actions, reducer } = homeSlice;
export { actions as homeActions, reducer as homeReducer };
