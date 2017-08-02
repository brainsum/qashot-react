import { normalize } from 'normalizr';
import { testListerSchema, runRespondSchema } from '../schema/mainApiSchemas';
import merge from 'lodash/merge';

export default function reducer(state={
  pages: {"0": []},
  pagination: {
    page: 0,
  },
  fetching: false,
  fetched: false,
  error: null,
  deleting: [],
  running: [],
}, action) {

  switch (action.type) {
    case "FETCH_TESTS_PENDING": {
      return {...state, fetching: true};
    }
    case "FETCH_TESTS_REJECTED": {
      return {...state, fetching: false, error: action.payload};
    }
    case "FETCH_TESTS_FULFILLED": {
      let norm = normalize(action.payload.data, testListerSchema);

      let pageItems = [...norm.result.entity];
      if (state.pages[norm.result.pagination.page]) {
        pageItems = [
          ...new Set([
            ...state.pages[norm.result.pagination.page],
            ...norm.result.entity,
          ])
        ];
      }

      return {
        ...state,
        fetching: false,
        fetched: true,
        pages: {
          ...state.pages,
          [norm.result.pagination.page]: pageItems
        },
        pagination: {
          ...state.pagination,
          ...norm.result.pagination,
        }
      };
    }
    case "RUN_TEST_ONLY_LISTER_PENDING": {
      return {...state, fetching: true};
    }
    case "RUN_TEST_ONLY_LISTER_REJECTED": {
      return {...state, fetching: false, error: action.payload};
    }
    case "RUN_TEST_ONLY_LISTER_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
      };
    }
    case "DELETE_TEST_LISTER_PENDING": {
      return {...state, fetching: true};
    }
    case "DELETE_TEST_LISTER_REJECTED": {
      return {...state, fetching: false, error: action.payload};
    }
    case "DELETE_TEST_LISTER_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
      };
    }
    case "DELETE_TEST_ID": {
      let newState = {...state};
      newState.deleting[action.payload] = true;
      return newState;
    }
    case "RUN_TEST_ONLY_ID": {
      let newState = {...state};
      newState.running[action.payload] = true;
      return newState;
    }
  }

  return state;
}
