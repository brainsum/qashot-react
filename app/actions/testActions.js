
import axios from '../utils/axios';

export function fetchTest(id) {
  return {
    type: "FETCH_TEST",
    payload: axios.get(`api/rest/v1/qa_shot_test/${id}?_format=json`)
  };
}

export function runTest(id) {
  return {
    type: "RUN_TEST_ONLY",
    payload: axios.post('api/rest/v1/qa_shot_test/' + id + '/run?_format=json', {
      test_stage: "",
      type: "a_b",
    }),
  }
}

export function deleteTest(id) {
  return {
    type: "DELETE_TEST",
    payload: axios.delete('api/rest/v1/qa_shot_test/' + id + '?_format=json'),
  };
}
