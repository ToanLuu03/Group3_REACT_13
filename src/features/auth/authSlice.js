import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  errorMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    handleLogin(state, _action) {
      state.loading = true;
    },
    handleLoginSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
    },
    handleLoginFailure(state, action) {
      state.loading = false;
      state.user = initialState.user;
      state.errorMessage = action.payload.errorMessage;
    },
    handleLogout(state) {
      state.user = initialState.user;
    },
    resetErrorMessage(state) {
      state.errorMessage = initialState.errorMessage;
    },
  },
});

const { actions, reducer } = authSlice;
export { actions as authActions, reducer as authReducer };
