import { call, put, takeLatest } from "redux-saga/effects";
import { setUserName } from "./usersSlice";

export function* handleSetUsersName(action) {
  try {
    // Directly set the role in the Redux state
    yield put(setUserName(action.payload));
  } catch (error) {
    console.error('Failed to set role', error);
  }
}

export function* usersSaga() {
  yield takeLatest('users/setUserNameSaga', handleSetUsersName); // Watch for the role action
}
