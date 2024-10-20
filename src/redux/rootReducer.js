import { combineReducers } from "@reduxjs/toolkit";
import { roleReducer } from "../features/role/roleSlice"
import { portalReducer } from "../features/portal/portalSlice";
import moduleReducer from '../features/classlist/moduleSlice';
import scheduleReducer from "../features/schedule/reducer";
import scheduleDetailReducer from "../features/schedule/scheduleDetailReducer";
import freeTimeReducer from "../features/schedule/freeTimeReducer";

export const rootReducer = combineReducers({
  role: roleReducer,
  portal: portalReducer,
  module: moduleReducer,
  schedule: scheduleReducer,
  scheduleDetail: scheduleDetailReducer,
  freeTimeReducer,
});