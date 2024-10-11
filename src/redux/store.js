// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { rootReducer } from "./rootReducer";
import { rootSaga } from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();

const preloadedState = {
  role: {
    selectedRole: localStorage.getItem("selectedRole") || null,
  },
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({ serializableCheck: false }),
    sagaMiddleware,
  ],
  preloadedState,
});

sagaMiddleware.run(rootSaga);
