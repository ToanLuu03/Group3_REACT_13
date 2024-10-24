// rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import usersReducer from "../features/users/usersSlice";
import trainerReducer from "../features/trainerInfo/trainerSlice"; 
import { roleReducer } from "../features/role/roleSlice";
import { portalReducer } from "../features/portal/portalSlice";
import moduleReducer from '../features/classlist/moduleSlice';
import scheduleReducer from "../features/schedule/reducer";
import scheduleDetailReducer from "../features/schedule/scheduleDetailReducer";
import freeTimeReducer from "../features/schedule/freeTimeReducer";
export const rootReducer = combineReducers({
  users: usersReducer,
  role: roleReducer,
  trainer: trainerReducer, 
  portal: portalReducer,
  module: moduleReducer,
  schedule: scheduleReducer,
  scheduleDetail: scheduleDetailReducer,
  freeTimeReducer,
});

export default rootReducer;
