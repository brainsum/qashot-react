
import axios from '../utils/axios';

export function fetchTest(id) {
  return {
    type: "FETCH_TEST",
    payload: axios.get(`api/rest/v1/qa_shot_test/${id}?_format=json`)
  };
}