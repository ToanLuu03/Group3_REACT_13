import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchClassList } from '../../api/AdminAPI/Classlist_api';
import { fetchModuleInfoStart, fetchModuleInfoSuccess, fetchModuleInfoFailure } from './moduleSlice';

function* fetchModuleInfoSaga() {
  try {
    const response = yield call(fetchClassList);
    yield put(fetchModuleInfoSuccess(response.data));
  } catch (error) {
    yield put(fetchModuleInfoFailure(error.message));
  }
}

export function* moduleWatcher() {
  yield takeLatest(fetchModuleInfoStart.type, fetchModuleInfoSaga);
}