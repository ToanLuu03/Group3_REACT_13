import { call, put, takeLatest } from "redux-saga/effects";
import { authActions } from "./authSlice";
import { _getUsers } from "../../utils/_DATA";
import { setUser } from "../../helpers/user";

export function* handleLogin(action) {
  const { username, password } = action.payload.data;

  try {
    const users = yield call(_getUsers);
    if (users[username]) {
      if (users[username]?.password !== password) {
        action.payload?.onError?.();
        yield put(
          authActions.handleLoginFailure({
            errorMessage: "Password is not correct!",
          })
        );
      } else {
        action.payload?.onSuccess?.({ user: users[username] });
        setUser(users[username]);
        yield put(authActions.handleLoginSuccess({ user: users[username] }));
      }
    } else {
      yield put(
        authActions.handleLoginFailure({
          errorMessage: "Username is not exist",
        })
      );
    }
  } catch (error) {
    action.payload?.onError?.(error);
    yield put(authActions.handleLoginFailure({ errorMessage: "Login error" }));
  }
}

export const authWatcher = [takeLatest(authActions.handleLogin, handleLogin)];
