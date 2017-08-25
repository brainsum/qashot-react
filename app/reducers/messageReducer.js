export default function reducer(state={
  errorMessage: [],
  warningMessage: [],
  successMessage: [],
  infoMessage: [],
}, action) {

  switch (action.type) {
    case "GET_PERIODIC_ENTITY_UPDATE_REJECTED":
    case "GET_PERIODIC_QUEUE_UPDATE_REJECTED": {
      // Don't show these errors for the user.
      return state;
    }
    case "LOGIN_PENDING": {
      return {
        ...state,
        infoMessage: [
          ...state.infoMessage,
          {
            id: "login",
            message: "Login in progress... please wait.",
            spinner: true,
            autoHideDelay: 0,
          }
        ]
      }
    }
    case "LOGIN_FULFILLED": {
      let location = false;
      state.infoMessage.map(function (item, i) {
        if (item.id === "login") {
          location = i;
        }
      });

      let localInfoMessage = [...state.infoMessage];
      if (location !== false) {
        location = parseInt(location);

        localInfoMessage = [
          ...state.infoMessage.splice(0, location),
          ...state.infoMessage.splice(location + 1),
        ];
      }

      return {
        ...state,
        infoMessage: localInfoMessage,
        successMessage: [
          ...state.successMessage,
          {
            id: "success_login",
            message: "Successfull login!",
            spinner: false,
            autoHideDelay: 3000,
          },
        ]
      }
    }
    case "LOGIN_REJECTED": {
      let location = false;
      state.infoMessage.map(function (item, i) {
        if (item.id === "login") {
          location = i;
        }
      });

      let localInfoMessage = [...state.infoMessage];
      if (location !== false) {
        location = parseInt(location);

        localInfoMessage = [
          ...state.infoMessage.splice(0, location),
          ...state.infoMessage.splice(location + 1),
        ];
      }

      return {
        ...state,
        infoMessage: localInfoMessage,
        errorMessage: [
          ...state.errorMessage,
          {
            fullMessage: (typeof action.payload.response !== "undefined" && action.payload.response.message ? action.payload.response.message + "\n" : "") + action.payload.message + "\nStack: " + action.payload.stack,
            message: action.payload.message,
            stack: action.payload.stack,
            spinner: false,
            autoHideDelay: 0,
          }
        ]
      }
    }
  }

  if (action.type.endsWith("_REJECTED")) {
    let errorMessage = [
      ...state.errorMessage,
      {
        fullMessage: (typeof action.payload.response !== "undefined" && typeof action.payload.response.data !== "undefined" && typeof action.payload.response.data.message !== "undefined" ? action.payload.response.data.message + "\n" : "") + action.payload.message + "\nStack: " + action.payload.stack,
        message: action.payload.message,
        stack: action.payload.stack,
        spinner: false,
        autoHideDelay: 0,
      }
    ];
    return {...state, errorMessage: errorMessage};
  }

  return state;
}
