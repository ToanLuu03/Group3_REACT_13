// rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import usersReducer from "../features/users/usersSlice";
import trainerReducer from "../features/trainerInfo/trainerSlice";
import { roleReducer } from "../features/role/roleSlice";
import { portalReducer } from "../features/portal/portalSlice";
import moduleReducer from "../features/classlist/moduleSlice";
import scheduleReducers from "../features/schedule/scheduleSlice";
export const rootReducer = combineReducers({
  users: usersReducer,
  role: roleReducer,
  trainer: trainerReducer,
  portal: portalReducer,
  module: moduleReducer,
  schedule: scheduleReducers,
});

export default rootReducer;
