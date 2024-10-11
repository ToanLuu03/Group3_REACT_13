import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchDataGpa, fetchDataFeedback } from '../../api/Portal_api';
import {
  fetchGpaDataStart,
  fetchGpaDataSuccess,
  fetchGpaDataFailure,
  fetchFeedbackDataStart,
  fetchFeedbackDataSuccess,
  fetchFeedbackDataFailure,
} from './portalSlice';

function* fetchGpaDataSaga() {
  try {
    const response = yield call(fetchDataGpa);
    yield put(fetchGpaDataSuccess(response.data));
  } catch (error) {
    yield put(fetchGpaDataFailure(error.message));
  }
}

function* fetchFeedbackDataSaga() {
  try {
    const response = yield call(fetchDataFeedback);
    yield put(fetchFeedbackDataSuccess(response.data));
  } catch (error) {
    yield put(fetchFeedbackDataFailure(error.message));
  }
}

export function* portalWatcher() {
  yield takeLatest(fetchGpaDataStart.type, fetchGpaDataSaga);
  yield takeLatest(fetchFeedbackDataStart.type, fetchFeedbackDataSaga);
}