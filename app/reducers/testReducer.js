export default function reducer(state={
  test: {},
  fetching: false,
  fetched: false,
  error: null,
}, action) {

  switch (action.type) {
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
      };
    }
  }

  return state;
}
