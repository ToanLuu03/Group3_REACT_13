import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: {},
  loading: false,
  errorMessage: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    handleGetListUsers(state, _action) {
      state.loading = true;
    },
    handleGetListUsersSuccess(state, action) {
      state.loading = false;
      state.users = action.payload.users;
    },
    handleGetListUsersFailure(state) {
      state.loading = false;
      state.users = initialState.users;
    },
    resetErrorMessage(state) {
      state.errorMessage = initialState.errorMessage;
    },
  },
});

const { actions, reducer } = usersSlice;
export { actions as usersActions, reducer as usersReducer };
