import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  moduleInfo: [],
  loading: false,
  error: null,
};

const moduleSlice = createSlice({
  name: 'module',
  initialState,
  reducers: {
    fetchModuleInfoStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchModuleInfoSuccess: (state, action) => {
      state.moduleInfo = action.payload;
      state.loading = false;
    },
    fetchModuleInfoFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchModuleInfoStart, fetchModuleInfoSuccess, fetchModuleInfoFailure } = moduleSlice.actions;
export default moduleSlice.reducer;