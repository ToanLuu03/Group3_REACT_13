import { all } from "redux-saga/effects";
import { roleWatcher } from "../features/role/roleSaga";
import { portalWatcher } from "../features/portal/portalSaga";
import { watchFetchEvents } from "../features/schedule/sagas"
import { moduleWatcher } from "../features/classlist/moduleSaga";

export function* rootSaga() {
  yield all([
    roleWatcher(),
    portalWatcher(),
    moduleWatcher(),
    watchFetchEvents(),
  ]);
}