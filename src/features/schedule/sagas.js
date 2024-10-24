import { call, all, put, takeLatest } from "redux-saga/effects";
import { fetchSchedule, fetchScheduleDetail, getFreeTime, postFreeTime, removeSlotTime } from "../../api/scheduleApi";
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
    getFreeTimeSuccess,
    GET_FREE_TIME_REQUEST,
    getFreeTimeFailure,
    removeSlotTimeSuccess,
    removeSlotTimeFailure,
    REMOVE_SLOT_TIME_REQUEST,
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

function* getFreeTimeSaga(action) {
    try {
        const response = yield call(getFreeTime, action.payload.trainerAccount);
        yield put(getFreeTimeSuccess(response.data.data));
    } catch (error) {
        yield put(getFreeTimeFailure(error.message));
    }
}

function* removeSlotTimeSaga(action) {
    try {
        yield call(removeSlotTime, action.payload.slotTimeDayParamId);
        yield put(removeSlotTimeSuccess());
    } catch (error) {
        yield put(removeSlotTimeFailure(error.message));
    }
}

export function* watchRemoveSlotTime() {
    yield takeLatest(REMOVE_SLOT_TIME_REQUEST, removeSlotTimeSaga);
}

export function* watchGetFreeTime() {
    yield takeLatest(GET_FREE_TIME_REQUEST, getFreeTimeSaga);
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
