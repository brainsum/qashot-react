import { normalize } from 'normalizr';
import { testSchema, testListerSchema, runRespondSchema } from '../schema/mainApiSchemas';
import merge from 'lodash/merge';

export default function reducer(state={
  metadata_lifetimes: {},
  results: {},
  scenarios: {},
  tests: {},
  viewports: {},
}, action) {

  switch (action.type) {
    case "FETCH_TEST_FULFILLED": {
      let norm = normalize(action.payload.data, testSchema);
      return merge({}, state, norm.entities);
    }
    case "FETCH_TESTS_FULFILLED":
    case "FETCH_AB_TESTS_FULFILLED":
    case "FETCH_BA_TESTS_FULFILLED": {
      let norm = normalize(action.payload.data, testListerSchema);
      return merge({}, state, norm.entities);
    }
    case "RUN_TEST_ONLY_FULFILLED":
    case "RUN_TEST_ONLY_LISTER_FULFILLED": {
      let norm = normalize(action.payload.data, runRespondSchema);
      return merge({}, state, norm.entities);
    }
    case "SAVE_TEST_FULFILLED": {
      let norm = normalize(action.payload.data, testSchema);
      return merge({}, state, norm.entities);
    }
  }

  return state;
}
