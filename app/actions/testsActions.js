
import axios from '../utils/axios';

export function fetchTests() {
  return {
    type: "FETCH_TESTS",
    payload: axios.get('api/rest/v1/test_list?_format=json')
  };
}