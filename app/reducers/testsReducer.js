export default function reducer(state={
  tests: [],
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
      return {
        ...state,
        fetching: false,
        fetched: true,
        tests: action.payload,
      };
    }
    case "RUN_TEST_ONLY_LISTER_PENDING": {
      return {...state, fetching: true};
    }
    case "RUN_TEST_ONLY_LISTER_REJECTED": {
      let newState = {...state, fetching: false, error: action.payload};
      //newState.deleting.splice(, 1);
      return newState;
    }
    case "RUN_TEST_ONLY_LISTER_FULFILLED": {
      let newState = {
        ...state,
        fetching: false,
        fetched: true,
        //tests: action.payload,
      };
      newState.running.splice(action.payload.data.entity.id[0].value, 1);

      let i = 0;
      let BreakException = {};
      try {
        newState.tests.data.entity.forEach((item) => {
          if (item.id[0].value == action.payload.data.entity.id[0].value) {
            throw BreakException;
          }
          i++;
        });
      } catch (e) {
        if (e !== BreakException) throw e;
      }
      newState.tests.data.entity[i] = action.payload.data.entity;
      return newState;
    }
    case "DELETE_TEST_LISTER_PENDING": {
      return {...state, fetching: true};
    }
    case "DELETE_TEST_LISTER_REJECTED": {
      let newState = {...state, fetching: false, error: action.payload};
      //newState.deleting.splice(, 1);
      return newState;
    }
    case "DELETE_TEST_LISTER_FULFILLED": {
      let newState = {
        ...state,
        fetching: false,
        fetched: true,
        //tests: action.payload,
      };
      //newState.deleting.splice(action.payload, 1);
      return newState;
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
