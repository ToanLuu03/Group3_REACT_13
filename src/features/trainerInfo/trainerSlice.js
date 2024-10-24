// trainerSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  trainerInfo: null,
};

const trainerSlice = createSlice({
  name: "trainer",
  initialState: {
    trainerInfo: {},
    fetchFlag: false, 
  },
  reducers: {
    setTrainerInfo(state, action) {
      state.trainerInfo = action.payload;
    },
    clearTrainerInfo(state) {
      state.trainerInfo = null;
    },
    toggleFetchFlag: (state) => {
      state.fetchFlag = !state.fetchFlag;  
    },
  },
});

export const { setTrainerInfo, clearTrainerInfo, toggleFetchFlag } = trainerSlice.actions;
export default trainerSlice.reducer;
