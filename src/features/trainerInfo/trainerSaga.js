// trainerSaga.js
import { put, takeLatest } from "redux-saga/effects";
import { setTrainerInfo } from "./trainerSlice";

export const UPDATE_TRAINER_INFO = "trainer/updateTrainerInfo";

export const updateTrainerInfo = (trainerInfo) => ({
  type: UPDATE_TRAINER_INFO,
  payload: trainerInfo,
});

function* updateTrainerInfoSaga(action) {
  try {
    yield put(setTrainerInfo(action.payload)); 
  } catch (error) {
    console.error("Error updating trainer info", error);
  }
}

export function* trainerWatcher() {
  yield takeLatest(UPDATE_TRAINER_INFO, updateTrainerInfoSaga);
}
