// src/store/roleSlice.js
import { createSlice } from '@reduxjs/toolkit';

const roleSlice = createSlice({
  name: 'role',
  initialState: {
    role: '', // Trạng thái ban đầu
  },
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload; // Lưu role được chọn
    },
  },
});

export const { setRole } = roleSlice.actions;
export default roleSlice.reducer;
