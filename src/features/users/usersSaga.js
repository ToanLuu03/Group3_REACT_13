import { call, put, takeLatest } from "redux-saga/effects";
import { usersActions } from "./usersSlice";
import { _getUsers } from "../../utils/_DATA";

export function* handleGetListUsers(action) {
  try {
    const response = yield call(_getUsers);

    if (response) {
      action?.payload?.onSuccess?.();
      yield put(usersActions.handleGetListUsersSuccess({ users: response }));
      return;
    }
  } catch (error) {
    action?.payload?.onError?.(error);
    yield put(usersActions.handleGetListUsersFailure());
  }
}

export const usersWatcher = [
  takeLatest(usersActions.handleGetListUsers, handleGetListUsers),
];
