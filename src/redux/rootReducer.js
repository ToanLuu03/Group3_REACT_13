import { combineReducers } from "@reduxjs/toolkit";
import { roleReducer } from "../features/role/roleSlice"
import { portalReducer } from "../features/portal/portalSlice";
import eventReducer from '../features/schedule/reducers'
import moduleReducer from '../features/classlist/moduleSlice';

export const rootReducer = combineReducers({
  role: roleReducer,
  portal: portalReducer,
  events: eventReducer,
  module: moduleReducer,
});