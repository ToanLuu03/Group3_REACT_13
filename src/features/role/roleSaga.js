// src/features/role/roleSaga.js
import { takeLatest, call } from "redux-saga/effects";
import { setRole, clearRole } from "./roleSlice";

// Generator function để lưu selectedRole vào localStorage
function* handleSetRole(action) {
  const selectedRole = action.payload;
  console.log("selectedRole:", selectedRole);     

  try {
    // Kiểm tra xem selectedRole có tồn tại không
    if (selectedRole) {
      // Sử dụng call để lưu selectedRole vào localStorage
      yield call([localStorage, "setItem"], "selectedRole", selectedRole);
    }
  } catch (error) {
    console.error("Failed to save selectedRole to localStorage:", error);
  }
}

// Generator function để xóa selectedRole từ localStorage
function* handleClearRole() {
  try {
    yield call([localStorage, "removeItem"], "selectedRole");
  } catch (error) {
    console.error("Failed to clear selectedRole from localStorage:", error);
  }
}

// Watcher saga
export function* roleWatcher() {
  yield takeLatest(setRole.type, handleSetRole);
  yield takeLatest(clearRole.type, handleClearRole);
}
