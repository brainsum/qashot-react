import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";

import reducer from "./reducers";
import {sourceId} from "./utils/helper";

/* Sync local storage name */
const storageKey = 'redux-local-tab-sync';
const localStoreKey = 'local-store';

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

/* Load store from local store */
function loadStoreFromLocalStore() {
  let storageString = localStorage.getItem(localStoreKey);
  if (typeof storageString !== "undefined" && storageString !== "" && storageString !== null) {
    store.dispatch({
      type: "LOAD_FROM_LOCAL_STORAGE",
      data: JSON.parse(storageString)
    });
  }
}
loadStoreFromLocalStore();

/* Write out store for newly created tabs initial state */
store.subscribe(() => {
  try {
    // This may throw exception, if the string is longer than 5,2M chars (~5Mb).
    localStorage.setItem(localStoreKey, JSON.stringify(store.getState()));
  }
  catch (e) {
    console.log("Error when tried to write out store into localStorage! Error is bellow.");
    console.log(e);
  }
});

/* Export out the store */
export default store;
