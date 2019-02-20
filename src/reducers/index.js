import { combineReducers } from "redux";

import user from "./userReducer";
import test from "./testReducer";
import tests from "./testsReducer";
import editor from "./editorReducer";
import entities from "./entitiesReducer";
import messages from "./messageReducer";

export default combineReducers({
  entities,
  user,
  test,
  tests,
  editor,
  messages,
})
