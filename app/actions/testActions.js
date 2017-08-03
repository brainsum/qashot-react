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

export function runTest(id) {
  return {
    type: "RUN_TEST_ONLY",
    payload: axios().post('api/rest/v1/qa_shot_test/' + id + '/queue?_format=json', {
      test_stage: "",
      type: "a_b",
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

export function addNewViewport() {
  return {
    type: "ADD_VIEWPORT_DETAILS_PAGE",
    payload: null
  };
}

export function deleteViewport(index) {
  return {
    type: "DELETE_VIEWPORT_DETAILS_PAGE",
    payload: index,
  }
}

export function changeValueOfViewport(value, index, field) {
  return {
    type: "CHANGE_FIELD_VALUE_VIEWPORT_DETAILS_PAGE",
    payload: {
      value: value,
      index: index,
      field: field,
    },
  }
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
