import { call, all, put, takeLatest } from "redux-saga/effects";
import { fetchSchedule, fetchScheduleDetail, postFreeTime } from "../../api/scheduleApi";
import {
    GET_SCHEDULE_REQUEST,
    getScheduleSuccess,
    getScheduleFailure,
    GET_SCHEDULE_DETAIL_REQUEST,
    getScheduleDetailSuccess,
    getScheduleDetailFailure,
    POST_FREE_TIME_REQUEST,
    postFreeTimeSuccess,
    postFreeTimeFailure,
} from "./actions";

function* fetchScheduleSaga(action) {
    try {
        const response = yield call(fetchSchedule, action.payload.account);
        yield put(getScheduleSuccess(response.data.data));
    } catch (error) {
        yield put(getScheduleFailure(error.message));
    }
}

function* fetchScheduleDetailSaga(action) {
    try {
        const detailRequests = action.payload.slotTimeIds.map((id) =>
            call(fetchScheduleDetail, id)
        );

        const detailResponses = yield all(detailRequests);

        const details = detailResponses.map(response => response.data.data);
        yield put(getScheduleDetailSuccess(details));
    } catch (error) {
        yield put(getScheduleDetailFailure(error.message));
    }
}

function* postFreeTimeSaga(action) {
    try {
        yield call(postFreeTime, action.payload);
        yield put(postFreeTimeSuccess());
    } catch (error) {
        yield put(postFreeTimeFailure(error.message));
    }
}

export function* watchPostFreeTime() {
    yield takeLatest(POST_FREE_TIME_REQUEST, postFreeTimeSaga);
}

export function* watchFetchSchedule() {
    yield takeLatest(GET_SCHEDULE_REQUEST, fetchScheduleSaga);
}

export function* watchFetchScheduleDetail() {
    yield takeLatest(GET_SCHEDULE_DETAIL_REQUEST, fetchScheduleDetailSaga);
}
