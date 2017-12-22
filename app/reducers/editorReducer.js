export default function reducer(state={
  title: "",
  viewports: {
    editOn: true,
    nextId: 1,
    viewportsItems: [
      {
        width: "",
        height: "",
        name: "",
        id: 0,
      },
    ],
  },
  pages: {
    nextId: 1,
    pagesItems: [
      {
        source: "",
        destination: "",
        name: "",
        id: 0,
      },
    ],
  },
  color: "#ff00ff",
  testerEngine: "phantomjs",
  tags: [],
  selectorsToHide: [],
  selectorsToRemove: [],
  result: null,
  resultIsTest: false,
  fetching: false,
  fetched: false,
  error: null,
  state: null,
}, action) {

  switch (action.type) {
    case "LOAD_FROM_LOCAL_STORAGE": {
      if (typeof action.data !== "undefined" && action.data !== null && typeof action.data.editor !== "undefined") {
        return action.data.editor;
      }
      return state;
    }
    case "LOAD_TEST_EDITOR":
    case "FETCH_TEST_PENDING": {
      return {...state,
        title: "",
        viewports: {
          editOn: true,
          nextId: 1,
          viewportsItems: [
            {
              width: "",
              height: "",
              name: "",
              id: 0,
            },
          ],
        },
        pages: {
          nextId: 1,
          pagesItems: [
            {
              source: "",
              destination: "",
              name: "",
              id: 0,
            },
          ],
        },
        color: "#ff00ff",
        testerEngine: "phantomjs",
        tags: [],
        selectorsToHide: [],
        selectorsToRemove: [],
        result: null,
        resultIsTest: false,
        fetching: false,
        fetched: false,
        error: null,
        state: null,
      };
    }
    case "EDIT_VIEWPORTS": {
      let newState = {...state};
      newState.viewports.editOn = true;
      return newState;
    }
    case "ADD_VIEWPORT": {
      let newState = {...state};
      newState.viewports.viewportsItems.push({
        width: "",
        height: "",
        name: "",
        id: newState.viewports.nextId,
      });
      newState.viewports.nextId++;
      return newState;
    }
    case "ADD_NEW_PAGE_URL_PAIR": {
      let newState = {...state};
      newState.pages.pagesItems.push({
        source: "",
        destination: "",
        name: "",
        id: newState.pages.nextId,
      });
      newState.pages.nextId++;
      return newState;
    }
    case "DELETE_PAGE_URL_PAIR": {
      let newState = {...state};
      newState.pages.pagesItems.splice(action.payload, 1);
      return newState;
    }
    case "DELETE_VIEWPORT": {
      let newState = {...state};
      newState.viewports.viewportsItems.splice(action.payload, 1);
      return newState;
    }
    case "CHANGE_FIELD_VALUE_PAGE_URL_PAIR": {
      let newState = {...state};
      switch (action.payload.field) {
        case "FIELD_SOURCE": {
          newState.pages.pagesItems[action.payload.index].source = action.payload.value;
          break;
        }
        case "FIELD_DESTINATION": {
          newState.pages.pagesItems[action.payload.index].destination = action.payload.value;
          break;
        }
        case "FIELD_NAME": {
          newState.pages.pagesItems[action.payload.index].name = action.payload.value;
          break;
        }
      }
      return newState;
    }
    case "CHANGE_FIELD_VALUE_VIEWPORT": {
      let newState = {...state};
      switch (action.payload.field) {
        case "FIELD_WIDTH": {
          newState.viewports.viewportsItems[action.payload.index].width = action.payload.value;
          break;
        }
        case "FIELD_HEIGHT": {
          newState.viewports.viewportsItems[action.payload.index].height = action.payload.value;
          break;
        }
        case "FIELD_NAME": {
          newState.viewports.viewportsItems[action.payload.index].name = action.payload.value;
          break;
        }
      }
      return newState;
    }
    case "CHANGE_FIELD_TITLE": {
      let newState = {...state};
      newState.title = action.payload;
      return newState;
    }
    case "CHANGE_FIELD_COLOR": {
      let newState = {...state};
      newState.color = action.payload;
      return newState;
    }
    case "DELETE_FIELD_HIDE": {
      let newState = {...state};
      newState.selectorsToHide = [
        ...state.selectorsToHide.slice(0, action.payload),
        ...state.selectorsToHide.slice(action.payload + 1)
      ];
      return newState;
    }
    case "CHANGE_FIELD_HIDE": {
      let newState = {...state};
      if (action.payload.i === state.selectorsToHide.length) {
        newState.selectorsToHide = [
          ...state.selectorsToHide,
          action.payload.value
        ];
      }
      else {
        newState.selectorsToHide = [
          ...state.selectorsToHide.slice(0, action.payload.i),
          action.payload.value,
          ...state.selectorsToHide.slice(action.payload.i + 1),
        ];
      }
      return newState;
    }
    case "DELETE_FIELD_REMOVE": {
      let newState = {...state};
      newState.selectorsToRemove = [
        ...state.selectorsToRemove.slice(0, action.payload),
        ...state.selectorsToRemove.slice(action.payload + 1)
      ];
      return newState;
    }
    case "CHANGE_FIELD_REMOVE": {
      let newState = {...state};
      if (action.payload.i === state.selectorsToRemove.length) {
        newState.selectorsToRemove = [
          ...state.selectorsToRemove,
          action.payload.value
        ];
      }
      else {
        newState.selectorsToRemove = [
          ...state.selectorsToRemove.slice(0, action.payload.i),
          action.payload.value,
          ...state.selectorsToRemove.slice(action.payload.i + 1),
        ];
      }
      return newState;
    }
    case "DELETE_FIELD_TAGS": {
      let newState = {...state};
      newState.tags = [
        ...state.tags.slice(0, action.payload),
        ...state.tags.slice(action.payload + 1)
      ];
      return newState;
    }
    case "CHANGE_FIELD_TAGS": {
      let newState = {...state};
      if (action.payload.i === state.tags.length) {
        newState.tags = [
          ...state.tags,
          action.payload.value,
        ];
      }
      else {
        newState.tags = [
          ...state.tags.slice(0, action.payload.i),
          action.payload.value,
          ...state.tags.slice(action.payload.i + 1),
        ];
      }
      return newState;
    }
    case "SAVE_TEST_PENDING": {
      return {...state, fetching: true, error: null, state: "Saving test..."};
    }
    case "SAVE_TEST_REJECTED": {
      return {...state, fetching: false, error: action.payload, state: null};
    }
    case "SAVE_TEST_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        resultIsTest: true,
        result: action.payload,
        state: null,
      };
    }
    case "RUN_TEST_PENDING": {
      return {...state, fetching: true, error: null, state: "Running tests..."};
    }
    case "RUN_TEST_REJECTED": {
      return {...state, fetching: false, error: action.payload, state: null};
    }
    case "RUN_TEST_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        resultIsTest: false,
        result: action.payload,
        state: null,
      };
    }
  }

  return state;
}
