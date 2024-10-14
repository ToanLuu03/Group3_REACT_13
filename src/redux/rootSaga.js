import { all } from "redux-saga/effects";
import { roleWatcher } from "../features/role/roleSaga";
import { portalWatcher } from "../features/portal/portalSaga";
import { moduleWatcher } from "../features/classlist/moduleSaga";
import { watchFetchSchedule, watchFetchScheduleDetail, watchPostFreeTime } from "../features/schedule/sagas";

export function* rootSaga() {
  yield all([
    roleWatcher(),
    portalWatcher(),
    moduleWatcher(),
    watchFetchSchedule(),
    watchFetchScheduleDetail(),
    watchPostFreeTime(),
  ]);
}