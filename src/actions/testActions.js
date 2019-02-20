import axios from '../utils/axios';
import {generateTestUrl} from "../utils/helper";
import store from "../store";

export function fetchTest(id) {
  let state = store.getState();
  if (!state.entities.tests[id] || !state.entities.tests[id].uuid) {
    return {
      type: "FETCH_TEST",
      payload: axios().get(`api/rest/v1/qa_shot_test/${id}?_format=json`)
    };
  }
  else {
    return {
      type: "DO_NOTHING",
      payload: null,
    }
  }
}

export function runTest(id, type, stage) {
  return {
    type: "RUN_TEST_ONLY",
    payload: axios().post('api/rest/v1/qa_shot_test/' + id + '/queue?_format=json', {
      stage: stage,
      type: type,
      frontend_url: generateTestUrl(id),
    }),
  }
}

export function deleteTest(id) {
  return {
    type: "DELETE_TEST",
    payload: axios().delete('api/rest/v1/qa_shot_test/' + id + '?_format=json'),
  };
}

export function patchTest(id, entityPart) {
  return (dispatch, getState) => {
    dispatch({
      type: "GET_CSRF_TOKEN",
      payload: axios().get('session/token?_format=json', {
        auth: false,
      }),
    }).then(() => {
      let curState = getState();
      dispatch({
        type: "PATCH_TEST",
        payload: axios().patch('api/rest/v1/qa_shot_test/' + id + '?_format=json', entityPart, {
          headers: {
            "X-CSRF-Token": curState.user.csrfToken.trim(),
          },
        }),
      });
    });
  };
}

export function addNewPageUrlPair() {
  return {
    type: "ADD_NEW_PAGE_URL_PAIR_DETAILS_PAGE",
    payload: null,
  }
}

export function deletePageUrlPair(index) {
  return {
    type: "DELETE_PAGE_URL_PAIR_DETAILS_PAGE",
    payload: index,
  }
}

export function changeValueOfPageUrlPair(value, index, field) {
  return {
    type: "CHANGE_FIELD_VALUE_PAGE_URL_PAIR_DETAILS_PAGE",
    payload: {
      value: value,
      index: index,
      field: field,
    },
  }
}
