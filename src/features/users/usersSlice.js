import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: {
    userName: '', // Khởi tạo userName rỗng trong users object
  },
  loading: false,
  errorMessage: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUserName: (state, action) => {
      state.users.userName = action.payload; // Đúng với cấu trúc state
    },
  },
});

export const { setUserName } = usersSlice.actions;
export default usersSlice.reducer;
