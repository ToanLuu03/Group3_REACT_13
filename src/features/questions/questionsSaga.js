import { call, put, takeLatest } from "redux-saga/effects";
import {
  _getQuestions,
  _saveQuestion,
  _saveQuestionAnswer,
} from "../../utils/_DATA";
import { questionsActions } from "./questionsSlice";

export function* handleGetQuestions(action) {
  try {
    const response = yield call(_getQuestions);

    if (response) {
      action?.payload?.onSuccess?.();
      yield put(
        questionsActions.handleGetQuestionsSuccess({ questions: response })
      );
      return;
    }
  } catch (error) {
    action?.payload?.onError?.(error);
    yield put(questionsActions.handleGetQuestionsFailure());
  }
}

export function* handleGetQuestionById(action) {
  const { questionId } = action.payload.data;

  try {
    const response = yield call(_getQuestions);

    if (response[questionId]) {
      action?.payload?.onSuccess?.();
      yield put(
        questionsActions.handleGetQuestionByIdSuccess({
          questionById: response[questionId],
        })
      );
      return;
    } else {
      action?.payload?.onError?.();
      yield put(questionsActions.handleGetQuestionByIdFailure());
      return;
    }
  } catch (error) {
    action?.payload?.onError?.(error);
    yield put(questionsActions.handleGetQuestionByIdFailure());
  }
}

export function* handleSaveQuestionByAnswer(action) {
  const { authedUser, questionId, answer } = action.payload.data;
  try {
    const response = yield call(_saveQuestionAnswer, {
      authedUser: authedUser,
      qid: questionId,
      answer: answer,
    });

    if (response) {
      action?.payload?.onSuccess?.();
      yield put(
        questionsActions.handleSaveQuestionByAnswerSuccess({
          questionById: response[questionId],
        })
      );
      return;
    }
  } catch (error) {
    action?.payload?.onError?.(error);
    yield put(questionsActions.handleSaveQuestionByAnswerFailure());
  }
}

export function* handleSaveNewQuestion(action) {
  const { author, firstOption, secondOption } = action.payload.data;
  try {
    const response = yield call(_saveQuestion, {
      author: author,
      optionOneText: firstOption,
      optionTwoText: secondOption,
    });

    if (response) {
      action?.payload?.onSuccess?.();
      yield put(questionsActions.handleSaveNewQuestionSuccess());
      return;
    }
  } catch (error) {
    action?.payload?.onError?.(error);
    yield put(questionsActions.handleSaveNewQuestionFailure());
  }
}

export const questionsWatcher = [
  takeLatest(questionsActions.handleGetQuestions, handleGetQuestions),
  takeLatest(questionsActions.handleGetQuestionById, handleGetQuestionById),
  takeLatest(
    questionsActions.handleSaveQuestionByAnswer,
    handleSaveQuestionByAnswer
  ),
  takeLatest(questionsActions.handleSaveNewQuestion, handleSaveNewQuestion),
];
