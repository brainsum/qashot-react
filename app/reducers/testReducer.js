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
    case "RUN_TEST_ONLY_PENDING": {
      return {...state, fetching: true, message: "Test is running now... Be patient...", testIsRunning: true, successMessage: null};
    }
    case "RUN_TEST_ONLY_REJECTED": {
      return {...state, fetching: false, error: action.payload, message: null, testIsRunning: false, successMessage: null};
    }
    case "RUN_TEST_ONLY_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        test: {
          config: action.payload.config,
          data: action.payload.data.entity,
          headers: action.payload.headers,
          request: action.payload.request,
          status: action.payload.status,
          statusText: action.payload.statusText,
        },
        message: null,
        testIsRunning: false,
        successMessage: action.payload.message,
      };
    }
    case "FETCH_TESTS_PENDING": {
      return {
        test: {},
        fetching: false,
        fetched: false,
        testIsRunning: false,
        error: null,
        successMessage: null,
      };
    }
  }

  return state;
}
