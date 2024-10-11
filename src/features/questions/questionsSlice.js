import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  questions: {},
  questionById: {},
  errorMessage: null,
};

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    // handle get questions
    handleGetQuestions(state, _action) {
      state.loading = true;
    },
    handleGetQuestionsSuccess(state, action) {
      state.loading = false;
      state.questions = action.payload.questions;
    },
    handleGetQuestionsFailure(state) {
      state.loading = false;
      state.questions = initialState.questions;
    },
    // handle get question by id
    handleGetQuestionById(state, _action) {
      state.loading = true;
    },
    handleGetQuestionByIdSuccess(state, action) {
      state.loading = false;
      state.questionById = action.payload.questionById;
    },
    handleGetQuestionByIdFailure(state) {
      state.loading = false;
      state.questionById = initialState.questionById;
    },
    // save question by answer
    handleSaveQuestionByAnswer(state, _action) {
      state.loading = true;
    },
    handleSaveQuestionByAnswerSuccess(state) {
      state.loading = false;
    },
    handleSaveQuestionByAnswerFailure(state) {
      state.loading = false;
    },
    // save new question
    handleSaveNewQuestion(state, _action) {
      state.loading = true;
    },
    handleSaveNewQuestionSuccess(state) {
      state.loading = false;
    },
    handleSaveNewQuestionFailure(state) {
      state.loading = false;
    },
    // reset error message
    resetErrorMessage(state) {
      state.errorMessage = initialState.errorMessage;
    },
  },
});

const { actions, reducer } = questionsSlice;
export { actions as questionsActions, reducer as questionsReducer };
