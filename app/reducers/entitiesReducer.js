import { normalize } from 'normalizr';
import {
  testSchema, testListerSchema, runRespondSchema,
  updateTestEntity, queueEntity
} from '../schema/mainApiSchemas';
import merge from 'lodash/merge';

export default function reducer(state={
  metadata_lifetimes: {},
  queue: {},
  results: {},
  scenarios: {},
  tests: {},
  viewports: {},
}, action) {

  switch (action.type) {
    case "PATCH_TEST_FULFILLED":
    case "FETCH_TEST_FULFILLED": {
      let norm = normalize(action.payload.data, testSchema);
      let newState = merge({}, state, norm.entities);
      newState = {...newState, tests: {...newState.tests, [norm.result]: norm.entities.tests[norm.result]}};
      return newState;
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
      let newState = merge({}, state, norm.entities);
      let queue = {
        ...newState.queue,
        [action.payload.data.entity.id]: {
          stage: action.payload.data.runner_settings.stage,
        }
      };
      newState = {
        ...newState,
        queue: queue,
      };
      return newState;
    }
    case "SAVE_TEST_FULFILLED": {
      let norm = normalize(action.payload.data, testSchema);
      return merge({}, state, norm.entities);
    }
    case "GET_PERIODIC_ENTITY_UPDATE_FULFILLED": {
      let norm = normalize(action.payload.data, updateTestEntity);
      let newState = merge({}, state, norm.entities);

      norm.result.updates.map(function (item) {
        newState.tests[item] = norm.entities.tests[item];
      });

      return newState;
    }
    case "GET_PERIODIC_QUEUE_UPDATE_FULFILLED": {
      let norm = normalize(action.payload.data, queueEntity);
      return {
        ...state,
        queue: typeof norm.entities.queue !== "undefined" ? norm.entities.queue : [],
      };
    }
  }

  return state;
}
