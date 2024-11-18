import { call, put, takeLatest, all } from "redux-saga/effects";
import {
  getScheduleRequest,
  getScheduleSuccess,
  getScheduleFailure,
  getScheduleDetailRequest,
  getScheduleDetailSuccess,
  getScheduleDetailFailure,
  getFreeTimeRequest,
  getFreeTimeSuccess,
  getFreeTimeFailure,
  removeSlotTimeRequest,
  removeSlotTimeSuccess,
  removeSlotTimeFailure,
} from "./scheduleSlice";

import {
  fetchSchedule,
  fetchScheduleDetail,
  getFreeTime,
  removeSlotTime,
} from "../../api/scheduleApi";
import { notification } from "antd";

// Fetch schedule saga
function* fetchScheduleSaga(action) {
  try {
    const response = yield call(fetchSchedule, action.payload.account);
    if (response.success) {
      yield put(getScheduleSuccess(response.data));
    } else {
      yield put(getScheduleFailure(response.message));
    }
  } catch (error) {
    yield put(getScheduleFailure(error.response?.message || error.message));
  }
}

// Fetch schedule detail saga
function* fetchScheduleDetailSaga(action) {
  try {
    const detailRequests = action.payload.slotTimeIds.map((id) =>
      call(fetchScheduleDetail, id)
    );
    const detailResponses = yield all(detailRequests);
    const details = detailResponses.map((response) => response.data);
    yield put(getScheduleDetailSuccess(details));
  } catch (error) {
    yield put(getScheduleDetailFailure(error.response?.message || error.message));
  }
}

// Fetch free time saga
function* getFreeTimeSaga(action) {
  try {
    const response = yield call(getFreeTime, action.payload.trainerAccount);
    if (response.success) {
      yield put(getFreeTimeSuccess(response.data));
    } else {
      yield put(getFreeTimeFailure(response.message));
    }
  } catch (error) {
    yield put(getFreeTimeFailure(error.response?.message || error.message));
  }
}

// Remove slot time saga
function* removeSlotTimeSaga(action) {
  try {
    const response = yield call(removeSlotTime, action.payload);

    if (response.success) {
      yield put(removeSlotTimeSuccess(action.payload));
      notification.success({
        message: "Delete Successful",
        description: response.data,
      });
    } else {
      throw new Error(response.message || "Delete operation failed");
    }
  } catch (error) {
    yield put(removeSlotTimeFailure(error.message));
    notification.error({
      message: "Delete Failed",
      description: `Error: ${error.message || "Failed to delete the event"}`,
    });
  }
}

// Watcher sagas
export function* watchScheduleActions() {
  yield takeLatest(getScheduleRequest.type, fetchScheduleSaga);
  yield takeLatest(getScheduleDetailRequest.type, fetchScheduleDetailSaga);
  yield takeLatest(getFreeTimeRequest.type, getFreeTimeSaga);
  yield takeLatest(removeSlotTimeRequest.type, removeSlotTimeSaga);
}
