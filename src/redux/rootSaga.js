// rootSaga.js
import { all } from "redux-saga/effects";
import { homeWatcher } from "../features/home/homeSaga";
import { questionsWatcher } from "../features/questions/questionsSaga";
import { roleSaga } from "../features/auth/roleSaga";
import { usersSaga } from "../features/users/usersSaga";
import { trainerWatcher } from "../features/trainerInfo/trainerSaga"; // Import trainer saga
import { moduleWatcher } from "../features/classlist/moduleSaga";
import { watchFetchSchedule, watchFetchScheduleDetail, watchGetFreeTime, watchPostFreeTime, watchRemoveSlotTime } from "../features/schedule/sagas";
import { portalWatcher } from "../features/portal/portalSaga";

export function* rootSaga() {
  yield all([
    ...homeWatcher,
    ...questionsWatcher,
    portalWatcher(),
    moduleWatcher(),
    roleSaga(),
    usersSaga(),
    trainerWatcher(), // Add trainerWatcher saga
    watchFetchSchedule(),
    watchFetchScheduleDetail(),
    watchPostFreeTime(),
    watchGetFreeTime(),
    watchRemoveSlotTime(),
  ]);
}
