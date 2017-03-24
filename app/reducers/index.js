import { combineReducers } from "redux";

import user from "./userReducer";
import test from "./testReducer";
import tests from "./testsReducer";
import editor from "./editorReducer";

export default combineReducers({
  user,
  test,
  tests,
  editor,
})
