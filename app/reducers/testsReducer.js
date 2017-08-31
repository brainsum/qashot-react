import { normalize } from 'normalizr';
import { testListerSchema } from '../schema/mainApiSchemas';
import merge from 'lodash/merge';

export default function reducer(state={
  pagesAB: {},
  paginationAB: {
    page: 0,
  },
  pagesBA: {},
  paginationBA: {
    page: 0,
  },
  fetching: false,
  fetched: false,
  error: null,
  deleting: [],
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
    case "FETCH_AB_TESTS_PENDING": {
      return {...state, fetching: true};
    }
    case "FETCH_AB_TESTS_REJECTED": {
      return {...state, fetching: false, error: action.payload};
    }
    case "FETCH_AB_TESTS_FULFILLED": {
      let norm = normalize(action.payload.data, testListerSchema);

      let pageItems = [...norm.result.entity];
      if (state.pagesAB[norm.result.pagination.page]) {
        pageItems = [
          ...new Set([
            ...state.pagesAB[norm.result.pagination.page],
            ...norm.result.entity,
          ])
        ];
      }

      return {
        ...state,
        fetching: false,
        fetched: true,
        pagesAB: {
          ...state.pagesAB,
          [norm.result.pagination.page]: pageItems
        },
        paginationAB: {
          ...state.paginationAB,
          ...norm.result.pagination,
        }
      };
    }
    case "FETCH_BA_TESTS_PENDING": {
      return {...state, fetching: true};
    }
    case "FETCH_BA_TESTS_REJECTED": {
      return {...state, fetching: false, error: action.payload};
    }
    case "FETCH_BA_TESTS_FULFILLED": {
      let norm = normalize(action.payload.data, testListerSchema);

      let pageItems = [...norm.result.entity];
      if (state.pagesBA[norm.result.pagination.page]) {
        pageItems = [
          ...new Set([
            ...state.pagesBA[norm.result.pagination.page],
            ...norm.result.entity,
          ])
        ];
      }

      return {
        ...state,
        fetching: false,
        fetched: true,
        pagesBA: {
          ...state.pagesBA,
          [norm.result.pagination.page]: pageItems
        },
        paginationBA: {
          ...state.paginationBA,
          ...norm.result.pagination,
        }
      };
    }
    case "UPDATE_CURRENT_PAGE_NUMBER": {
      let paginationName = "pagination";
      if (action.payload.type === "a_b") {
        paginationName = "paginationAB";
      }
      else if (action.payload.type === "before_after") {
        paginationName = "paginationBA";
      }

      let pagination = {
        ...state[paginationName],
        links: {
          self: "api/rest/v1/test_list?_format=json&page=" + action.payload.page + "&limit=" + state[paginationName].page
        },
        page: action.payload.page,
      };

      if (action.payload.page > 1) {
        pagination.links.first = "api/rest/v1/test_list?_format=json&page=1&limit=" + pagination.limit + "&type=" + action.payload.type;
        pagination.links.previous = "api/rest/v1/test_list?_format=json&page=" + (action.payload.page - 1) + "&limit=" + pagination.limit + "&type=" + action.payload.type;
      }

      if (action.payload.page < pagination.total_pages) {
        pagination.links.next = "api/rest/v1/test_list?_format=json&page=" + (action.payload.page + 1) + "&limit=" + pagination.limit + "&type=" + action.payload.type;
        pagination.links.last = "api/rest/v1/test_list?_format=json&page=" + pagination.total_pages + "&limit=" + pagination.limit + "&type=" + action.payload.type;
      }

      return {...state, [paginationName]: pagination}
    }
    case "DELETE_TEST_LISTER_PENDING": {
      return {...state, fetching: true};
    }
    case "DELETE_TEST_LISTER_REJECTED": {
      return {...state, fetching: false, error: action.payload};
    }
    case "DELETE_TEST_LISTER_FULFILLED": {
      let url = action.payload.config.url;
      let id = parseInt(url.match(/\/([0-9]*)\?/i)[1]);
      let type = url.match(/type=([a-z0-9_]*)/i)[1];
      let propName = "pagesAB";
      if (type === "before_after") {
        propName = "pagesBA";
      }
      let pageNum = 1, itemNum = 0, found = false;

      let pageKeys = Object.keys(state[propName]);
      for (pageNum = 0; pageNum < pageKeys.length; pageNum++) {
        for (itemNum = 0; itemNum < Object.keys(state[propName][pageKeys[pageNum]]).length; itemNum++) {
          if (state[propName][pageKeys[pageNum]][itemNum] === id) {
            found = true;
            break;
          }
        }

        if (found) {
          break;
        }
      }

      let newPageItems = [
        ...state[propName][pageKeys[pageNum]].slice(0, itemNum),
        ...state[propName][pageKeys[pageNum]].slice(itemNum + 1),
      ];

      let newPages = {
        ...state[propName],
        [pageKeys[pageNum]]: newPageItems,
      };

      return {
        ...state,
        [propName]: newPages,
        fetching: false,
        fetched: true,
      };
    }
    case "DELETE_TEST_ID": {
      let newState = {...state};
      newState.deleting[action.payload] = true;
      return newState;
    }


    case "SAVE_TEST_FULFILLED": {
      let entity = action.payload.data;
      let paginationName = "pagination";
      let pagesName = "pages";
      if (entity.type === "a_b") {
        paginationName = "paginationAB";
        pagesName = "pagesAB";
      }
      else if (entity.type === "before_after") {
        paginationName = "paginationBA";
        pagesName = "pagesBA";
      }

      let pages = state[pagesName][state[paginationName].total_pages];
      if (typeof pages !== "undefined") {
        if (pages.length < state[paginationName].limit) {
          let newPageItems = [...pages, entity.id];
          let newPages = {...state[pagesName], [state[paginationName].total_pages]: newPageItems};
          return {...state, [pagesName]: newPages}
        }
        else {
          let newPagination = {
            ...state[paginationName],
            total_pages: (parseInt(state[paginationName].total_pages) + 1).toString(),
            total_entities: (parseInt(state[paginationName].total_entities) + 1).toString(),
          };
          let newPages = {
            ...state[pagesName],
            [(parseInt(state[paginationName].total_pages) + 1).toString()]: [entity.id],
          };

          return {
            ...state,
            [pagesName]: newPages,
            [paginationName]: newPagination,
          };
        }
      }

      return state;
    }
  }

  return state;
}
