import axios from '../utils/axios';
import {generateTestUrl} from "../utils/helper";

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

export function changeValueOfColor(value) {
  return {
    type: "CHANGE_FIELD_COLOR",
    payload: value,
  }
}

export function deleteHideValue(i) {
  return {
    type: "DELETE_FIELD_HIDE",
    payload: i,
  }
}

export function changeOrAddHideValue(i, value) {
  return {
    type: "CHANGE_FIELD_HIDE",
    payload: {
      i: i,
      value: value
    },
  }
}

export function deleteRemoveValue(i) {
  return {
    type: "DELETE_FIELD_REMOVE",
    payload: i,
  }
}

export function changeOrAddRemoveValue(i, value) {
  return {
    type: "CHANGE_FIELD_REMOVE",
    payload: {
      i: i,
      value: value
    },
  }
}

export function deleteTagsValue(i) {
  return {
    type: "DELETE_FIELD_TAGS",
    payload: i,
  }
}

export function changeOrAddTagsValue(i, value) {
  return {
    type: "CHANGE_FIELD_TAGS",
    payload: {
      i: i,
      value: value
    },
  }
}

export function saveTest(curState, type) {
  let scenarios = [], viewport = [];

  curState.viewports.viewportsItems.forEach((viewportItem) => {
    viewport.push({
      field_name: viewportItem.name,
      field_width: viewportItem.width,
      field_height: viewportItem.height,
    });
  });

  curState.pages.pagesItems.forEach((pageItems) => {
    scenarios.push({
      field_label: pageItems.name,
      field_reference_url: pageItems.source,
      field_test_url: pageItems.destination,
    });
  });

  return {
    type: "SAVE_TEST",
    payload: axios().post('api/rest/v1/qa_shot_test?_format=json', {
      user_id: 1,
      name: curState.title,
      type: type,
      field_scenario: scenarios,
      field_viewport: viewport,
      field_tag: curState.tags,
      field_tester_engine: curState.testerEngine,
      selectors_to_hide: curState.selectorsToHide,
      selectors_to_remove: curState.selectorsToRemove,
      field_diff_color: curState.color.replace('#', ''),
    }),
  }
}

export function saveAndRunTest(curState, type) {
  return (dispatch, getState) => {
    dispatch(saveTest(curState)).then(() => {
      let curState = getState();
      const { error, result, resultIsTest } = curState.editor;
      if (!error && result && resultIsTest) {
        dispatch({
          type: "RUN_TEST",
          payload: axios().post('api/rest/v1/qa_shot_test/' + result.data.id[0].value + '/queue?_format=json', {
            test_stage: type === "a_b" ? "" : "reference",
            type: type,
            frontend_url: generateTestUrl(id),
          }),
        });
      }
    });
  };
}
