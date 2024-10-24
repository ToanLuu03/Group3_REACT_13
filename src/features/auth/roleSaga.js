import { put, takeLatest } from 'redux-saga/effects';
import { setRole } from './roleSlice';

function* handleSetRole(action) {
  try {
    // Directly set the role in the Redux state
    yield put(setRole(action.payload));
  } catch (error) {
    console.error('Failed to set role', error);
  }
}

export function* roleSaga() {
  yield takeLatest('role/setRoleSaga', handleSetRole); // Watch for the role action
}
