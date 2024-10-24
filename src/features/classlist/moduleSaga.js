import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchClassList } from '../../api/AdminAPI/Classlist_api';
import { fetchModuleInfoStart, fetchModuleInfoSuccess, fetchModuleInfoFailure } from './moduleSlice';

function* fetchModuleInfoSaga() {
  const trainerAcc = localStorage.getItem('trainerAccount');
  try {
    // Call the API function using the proper `call` syntax
    const response = yield call(fetchClassList, trainerAcc);
    yield put(fetchModuleInfoSuccess(response.data)); // Use response.data here
  } catch (error) {
    yield put(fetchModuleInfoFailure(error.message));
  }
}

export function* moduleWatcher() {
  yield takeLatest(fetchModuleInfoStart.type, fetchModuleInfoSaga);
}