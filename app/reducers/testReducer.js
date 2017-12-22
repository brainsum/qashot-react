import { normalize } from 'normalizr';
import { testSchema } from '../schema/mainApiSchemas';

export default function reducer(state={
  test: {},
  fetching: false,
  fetched: false,
  testIsRunning: false,
  error: null,
  message: null,
  successMessage: null,
}, action) {

  switch (action.type) {
    case "LOAD_FROM_LOCAL_STORAGE": {
      if (typeof action.data !== "undefined" && action.data !== null && typeof action.data.test !== "undefined") {
        return action.data.test;
      }
      return state;
    }
    case "FETCH_TEST_PENDING": {
      return {...state, fetching: true};
    }
    case "FETCH_TEST_REJECTED": {
      return {...state, fetching: false, error: action.payload};
    }
    case "FETCH_TEST_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        test: action.payload,
        testIsRunning: false,
        error: null,
        message: null,
        successMessage: null,
      };
    }
    case "FETCH_test_PENDING": {
      return {
        test: {},
        fetching: false,
        fetched: false,
        testIsRunning: false,
        error: null,
        successMessage: null,
      };
    }
    case "ADD_NEW_PAGE_URL_PAIR_DETAILS_PAGE": {
      let newState = {...state};
      newState.test = {...newState.test};
      newState.test.data = {...newState.test.data};
      newState.test.data.field_scenario.push({
        source: "",
        destination: "",
        name: "",
      });
      return newState;
    }
    case "DELETE_PAGE_URL_PAIR_DETAILS_PAGE": {
      let newState = {...state};
      newState.test = {...newState.test};
      newState.test.data = {...newState.test.data};
      newState.test.data.field_scenario.splice(action.payload, 1);
      return newState;
    }
    case "CHANGE_FIELD_VALUE_PAGE_URL_PAIR_DETAILS_PAGE": {
      let newState = {...state};
      newState.test = {...newState.test};
      newState.test.data = {...newState.test.data};
      switch (action.payload.field) {
        case "FIELD_SOURCE": {
          newState.test.data.field_scenario[action.payload.index].source = action.payload.value;
          break;
        }
        case "FIELD_DESTINATION": {
          newState.test.data.field_scenario[action.payload.index].destination = action.payload.value;
          break;
        }
        case "FIELD_NAME": {
          newState.test.data.field_scenario[action.payload.index].name = action.payload.value;
          break;
        }
      }
      return newState;
    }
  }

  return state;
}
