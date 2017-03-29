import axios from '../utils/axios';

export function loadTestEditor() {
  return {
    type: "LOAD_TEST_EDITOR",
    payload: null,
  }
}

export function editViewports() {
  return {
    type: "EDIT_VIEWPORTS",
    payload: null,
  }
}

export function addNewViewport() {
  return {
    type: "ADD_VIEWPORT",
    payload: null,
  }
}

export function addNewPageUrlPair() {
  return {
    type: "ADD_NEW_PAGE_URL_PAIR",
    payload: null,
  }
}

export function deletePageUrlPair(index) {
  return {
    type: "DELETE_PAGE_URL_PAIR",
    payload: index,
  }
}

export function deleteViewport(index) {
  return {
    type: "DELETE_VIEWPORT",
    payload: index,
  }
}

export function changeValueOfPageUrlPair(value, index, field) {
  return {
    type: "CHANGE_FIELD_VALUE_PAGE_URL_PAIR",
    payload: {
      value: value,
      index: index,
      field: field,
    },
  }
}

export function changeValueOfViewport(value, index, field) {
  return {
    type: "CHANGE_FIELD_VALUE_VIEWPORT",
    payload: {
      value: value,
      index: index,
      field: field,
    },
  }
}

export function changeValueOfTitle(value) {
  return {
    type: "CHANGE_FIELD_TITLE",
    payload: value,
  }
}

export function saveTest(curState) {
  let scenarios = [], viewport = [];

  curState.viewports.viewportsItems.forEach((viewportItem) => {
    viewport.push({
      name: viewportItem.name,
      width: viewportItem.width,
      height: viewportItem.height,
    });
  });

  curState.pages.pagesItems.forEach((pageItems) => {
    scenarios.push({
      label: pageItems.name,
      referenceUrl: pageItems.source,
      testUrl: pageItems.destination,
    });
  });

  return {
    type: "SAVE_TEST",
    payload: axios.post('api/rest/v1/qa_shot_test?_format=json', {
      user_id: [ { target_id: 1 } ],
      name: [ { value: curState.title } ],
      type: [ { target_id: 'a_b' } ],
      field_scenario: scenarios,
      viewport: viewport,
    }),
  }
}

export function saveAndRunTest(curState) {
  return (dispatch, getState) => {
    dispatch(saveTest(curState)).then(() => {
      let curState = getState();
      const { error, result, resultIsTest } = curState.editor;
      if (!error && result && resultIsTest) {
        dispatch({
          type: "RUN_TEST",
          payload: axios.post('api/rest/v1/qa_shot_test/' + result.data.id[0].value + '/run?_format=json', {
            test_stage: "",
            type: "a_b",
          }),
        });
      }
    });
  };
}
