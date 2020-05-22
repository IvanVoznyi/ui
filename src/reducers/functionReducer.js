import {
  FETCH_FUNCTIONS_BEGIN,
  FETCH_FUNCTIONS_FAILURE,
  FETCH_FUNCTIONS_SUCCESS,
  SET_FUNCTIONS_TEMPLATES,
  FETCH_SELECT_FUNCTION_BEGIN,
  FETCH_SELECT_FUNCTION_SUCCESS,
  REMOVE_SELECT_FUNCTION,
  FETCH_SELECT_FUNCTION_FAILURE
} from '../constants'

const initialState = {
  functions: [],
  loading: false,
  error: null,
  templatesCatalog: [],
  selectedFunction: {}
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_FUNCTIONS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_FUNCTIONS_SUCCESS:
      return {
        ...state,
        functions: payload,
        loading: false
      }
    case FETCH_FUNCTIONS_FAILURE:
      return {
        ...state,
        functions: [],
        loading: false,
        error: payload
      }
    case SET_FUNCTIONS_TEMPLATES:
      return {
        ...state,
        templates: payload
      }
    case FETCH_SELECT_FUNCTION_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_SELECT_FUNCTION_SUCCESS:
      return {
        ...state,
        loading: false,
        selectedFunction: payload
      }
    case FETCH_SELECT_FUNCTION_FAILURE:
      return {
        ...state,
        loading: false,
        selectedFunction: {},
        error: payload
      }
    case REMOVE_SELECT_FUNCTION:
      return {
        ...state,
        selectedFunction: {}
      }
    default:
      return state
  }
}
