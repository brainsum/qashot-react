import axios from '../utils/axios';
import {generateTestUrl} from "../utils/helper";
import store from "../store";

export function fetchTests(testType = "") {
  let state = store.getState();
  if (!state.tests.pagesAB[1] && testType === "a_b" || !state.tests.pagesBA[1] && testType === "before_after" || testType === "") {
    return {
      type: testType === "a_b" ? "FETCH_AB_TESTS" : (testType === "before_after" ? "FETCH_BA_TESTS" : "FETCH_TESTS"),
      payload: axios().get('api/rest/v1/test_list?_format=json&type=' + testType)
    };
  }

  return {
    type: "UPDATE_CURRENT_PAGE_NUMBER",
    payload: {page: 1, type: testType},
  }
}

export function fetchTestsByUrl(url) {
  let state = store.getState();
  let page = parseInt(url.match(/page=([0-9]*)/i)[1]);
  let type = url.match(/type=([a-z0-9_]*)/i)[1];

  if (!state.tests.pagesAB[page] && type === "a_b" || !state.tests.pagesBA[page] && type === "before_after" || type === "") {
    return {
      type: type === "a_b" ? "FETCH_AB_TESTS" : (type === "before_after" ? "FETCH_BA_TESTS" : "FETCH_TESTS"),
      payload: axios().get(url)
    };
  }

  return {
    type: "UPDATE_CURRENT_PAGE_NUMBER",
    payload: {page: page, type: type},
  }
}

export function fetchTestsByPageAndLimit(page, limit, type) {
  let state = store.getState();
  if (!state.tests.pagesAB[page] && type === "a_b" || !state.tests.pagesBA[page] && type === "before_after" || type === "") {
    return {
      type: type === "a_b" ? "FETCH_AB_TESTS" : (type === "before_after" ? "FETCH_BA_TESTS" : "FETCH_TESTS"),
      payload: axios().get('api/rest/v1/test_list?_format=json&page=' + page + '&limit=' + limit + '&type=' + type)
    };
  }

  return {
    type: "UPDATE_CURRENT_PAGE_NUMBER",
    payload: {page: page, type: type},
  }
}

export function runTest(id, stage) {
  return (dispatch) => {
    dispatch({type: "RUN_TEST_ONLY_ID", payload: id});
    dispatch({
      type: "RUN_TEST_ONLY_LISTER",
      payload: axios().post('api/rest/v1/qa_shot_test/' + id + '/queue?_format=json', {
        stage: stage,
        type: "a_b",
        frontend_url: generateTestUrl(id),
      }),
    });
  };
}

export function deleteTest(id, type) {
  return (dispatch) => {
    dispatch({type: "DELETE_TEST_ID", payload: id});
    dispatch({
      type: "DELETE_TEST_LISTER",
      payload: axios().delete('api/rest/v1/qa_shot_test/' + id + '?_format=json&type=' + type),
    });
  };
}