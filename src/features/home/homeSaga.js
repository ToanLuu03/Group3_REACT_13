import { call, put, takeLatest } from "redux-saga/effects";
import { _getQuestions } from "../../utils/_DATA";
import { homeActions } from "./homeSlice";

export function* handleGetQuestions(action) {
  try {
    const response = yield call(_getQuestions);

    if (response) {
      action?.payload?.onSuccess?.();
      yield put(homeActions.handleGetQuestionsSuccess({ questions: response }));
      return;
    }
  } catch (error) {
    action?.payload?.onError?.(error);
    yield put(homeActions.handleGetQuestionsFailure());
  }
}

export const homeWatcher = [
  takeLatest(homeActions.handleGetQuestions, handleGetQuestions),
];
