export default function reducer(state={
  user: {},
  loginname: null,
  password: null,
  error: null,
}, action) {

  switch (action.type) {
    case "LOGIN_PENDING": {
      return {...state, error: null};
    }
    case "LOGIN_REJECTED": {
      return {...state, error: action.payload};
    }
    case "LOGIN_FULFILLED": {
      return {
        ...state,
        user: action.payload.data,
        error: false,
      };
    }
    case "SET_LOGIN_DATA": {
      return {
        ...state,
        loginname: action.payload.loginname,
        password: action.payload.password,
      }
    }
  }

  return state;
}
