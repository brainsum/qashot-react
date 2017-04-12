
import axios from '../utils/axios';
import {generateTestUrl} from "../utils/helper";

export function fetchTests() {
  return {
    type: "FETCH_TESTS",
    payload: axios.get('api/rest/v1/test_list?_format=json')
  };
}

export function fetchTestsByUrl(url) {
  return {
    type: "FETCH_TESTS",
    payload: axios.get(url)
  };
}

export function fetchTestsByPageAndLimit(page, limit) {
  return {
    type: "FETCH_TESTS",
    payload: axios.get('api/rest/v1/test_list?_format=json&page=' + page + '&limit=' + limit)
  };
}

export function runTest(id) {
  return (dispatch) => {
    dispatch({type: "RUN_TEST_ONLY_ID", payload: id});
    dispatch({
      type: "RUN_TEST_ONLY_LISTER",
      payload: axios.post('api/rest/v1/qa_shot_test/' + id + '/run?_format=json', {
        test_stage: "",
        type: "a_b",
        frontend_url: generateTestUrl(id),
      }),
    });
  };
}

export function deleteTest(id) {
  return (dispatch) => {
    dispatch({type: "DELETE_TEST_ID", payload: id});
    dispatch({
      type: "DELETE_TEST_LISTER",
      payload: axios.delete('api/rest/v1/qa_shot_test/' + id + '?_format=json'),
    });
  };
}