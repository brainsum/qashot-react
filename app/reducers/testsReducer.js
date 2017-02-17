export default function reducer(state={
  tests: [],
  fetching: false,
  fetched: false,
  error: null,
}, action) {

  switch (action.type) {
    case "FETCH_TESTS_PENDING": {
      return {...state, fetching: true};
    }
    case "FETCH_TESTS_REJECTED": {
      return {...state, fetching: false, error: action.payload};
    }
    case "FETCH_TESTS_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        tests: action.payload,
      };
    }
  }

  return state;
}
