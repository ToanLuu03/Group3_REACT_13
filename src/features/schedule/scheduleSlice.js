import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  schedule: [],
  scheduleDetail: [],
  freeTime: [],
  loading: {
    getSchedule: false,
    getScheduleDetail: false,
    getFreeTime: false,
    removeSlotTime: false,
  },
  error: {
    getSchedule: null,
    getScheduleDetail: null,
    getFreeTime: null,
    removeSlotTime: null,
  },
};

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    // Schedule reducers
    getScheduleRequest: (state) => {
      state.loading.getSchedule = true;
      state.error.getSchedule = null;
    },
    getScheduleSuccess: (state, action) => {
      state.loading.getSchedule = false;
      state.schedule = action.payload;
    },
    getScheduleFailure: (state, action) => {
      state.loading.getSchedule = false;
      state.error.getSchedule = action.payload;
    },

    // Schedule detail reducers
    getScheduleDetailRequest: (state) => {
      state.loading.getScheduleDetail = true;
      state.error.getScheduleDetail = null;
    },
    getScheduleDetailSuccess: (state, action) => {
      state.loading.getScheduleDetail = false;
      state.scheduleDetail = action.payload;
    },
    getScheduleDetailFailure: (state, action) => {
      state.loading.getScheduleDetail = false;
      state.error.getScheduleDetail = action.payload;
    },

    // Free time reducers
    getFreeTimeRequest: (state) => {
      state.loading.getFreeTime = true;
      state.error.getFreeTime = null;
    },
    getFreeTimeSuccess: (state, action) => {
      state.loading.getFreeTime = false;
      state.freeTime = action.payload;
    },
    getFreeTimeFailure: (state, action) => {
      state.loading.getFreeTime = false;
      state.error.getFreeTime = action.payload;
    },

    // Remove slot time reducers
    removeSlotTimeRequest: (state) => {
      state.loading.removeSlotTime = true;
      state.error.removeSlotTime = null;
    },
    removeSlotTimeSuccess: (state, action) => {
      state.loading.removeSlotTime = false;
      state.error.removeSlotTime = null;
      state.schedule = state.schedule.map((item) => {
        return {
          ...item,
          dayParam: item.dayParam.filter(
            (day) => day.id !== action.payload
          ),
        };
      });
    },
    removeSlotTimeFailure: (state, action) => {
      state.loading.removeSlotTime = false;
      state.error.removeSlotTime = action.payload;
    },
  },
});

export const {
  getScheduleRequest,
  getScheduleSuccess,
  getScheduleFailure,
  getScheduleDetailRequest,
  getScheduleDetailSuccess,
  getScheduleDetailFailure,
  getFreeTimeRequest,
  getFreeTimeSuccess,
  getFreeTimeFailure,
  removeSlotTimeRequest,
  removeSlotTimeSuccess,
  removeSlotTimeFailure,
} = scheduleSlice.actions;

export default scheduleSlice.reducer;
