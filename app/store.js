import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";

import reducer from "./reducers";
import {sourceId} from "./utils/helper";

/* Sync local storage name */
const storageKey = 'redux-local-tab-sync';

/* Sync message setter and helper functions */
function wrapAction(action) {
  return {
    action,
    sourceId,
    time: Date.now()
  }
}
function storageMiddleware() {
  return () => next => action => {
    if(action.type!=="FROM_OTHER_TAB"){
      const wrappedAction = wrapAction(action);
      try {
        localStorage.setItem(storageKey, JSON.stringify(wrappedAction));
      }
      catch (e) {
        console.log("Error when tried to write localStorage! Error is bellow.");
        console.log(e);
      }
    }else{
      action=action.data;
    }
    next(action);
  }
}

/* Sync message broadcaster inside the React redux state */
function createStorageListener(store, evt) {
  if (evt.key === storageKey) {
    const wrappedAction = JSON.parse(evt.newValue);

    if (wrappedAction.sourceId !== sourceId) {
      store.dispatch({
        type: "FROM_OTHER_TAB",
        data: wrappedAction.action
      });
    }
  }
}

/* Define store */
const middleware = applyMiddleware(promise(), thunk, storageMiddleware(), logger());
const store = createStore(reducer, middleware);

/* Create event listener for storege stage */
window.addEventListener('storage', (evt) => createStorageListener(store, evt));

/* Export out the store */
export default store;
