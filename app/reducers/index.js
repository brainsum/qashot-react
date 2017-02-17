import { combineReducers } from "redux";

import user from "./userReducer";
import test from "./testReducer";
import tests from "./testsReducer";

export default combineReducers({
  user,
  test,
  tests,
})
