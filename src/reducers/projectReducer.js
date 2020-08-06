import {
  CREATE_PROJECT_FAILURE,
  CREATE_PROJECT_SUCCESS,
  FETCH_PROJECTS_BEGIN,
  FETCH_PROJECTS_FAILURE,
  FETCH_PROJECTS_SUCCESS,
  REMOVE_NEW_PROJECT,
  REMOVE_PROJECT_ERROR,
  SET_NEW_PROJECT_DESCRIPTION,
  SET_NEW_PROJECT_NAME,
  FETCH_PROJECT,
  REMOVE_PROJECT,
  FETCH_PROJECT_JOBS,
  PROJECT_JOBS_LOADING,
  PROJECT_JOBS_ERROR,
  PROJECT_LOADING,
  PROJECT_ERROR,
  PROJECT_FUNCTIONS_LOADING,
  FETCH_PROJECT_FUNCTIONS,
  PROJECT_FUNCTIONS_ERROR
} from '../constants'

const initialState = {
  projects: [],
  loading: false,
  error: null,
  newProject: {
    name: '',
    description: ''
  },
  project: {
    data: null,
    loading: false,
    error: null,
    jobs: {
      data: null,
      loading: false,
      error: null
    },
    functions: {
      data: null,
      loading: false,
      error: null
    }
  }
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case PROJECT_LOADING:
      return {
        ...state,
        project: {
          ...state.project,
          loading: true
        }
      }
    case PROJECT_ERROR:
      return {
        ...state,
        project: {
          ...state.project,
          loading: false,
          error: payload
        }
      }
    case PROJECT_JOBS_LOADING:
      return {
        ...state,
        project: {
          ...state.project,
          jobs: {
            ...state.project.jobs,
            loading: true
          }
        }
      }
    case PROJECT_FUNCTIONS_LOADING:
      return {
        ...state,
        project: {
          ...state.project,
          functions: {
            ...state.project.functions,
            loading: true
          }
        }
      }
    case PROJECT_JOBS_ERROR:
      return {
        ...state,
        project: {
          ...state.project,
          jobs: {
            ...state.project.jobs,
            error: payload,
            loading: false
          }
        }
      }
    case PROJECT_FUNCTIONS_ERROR:
      return {
        ...state,
        project: {
          ...state.project,
          functions: {
            ...state.project.functions,
            error: payload
          }
        }
      }
    case CREATE_PROJECT_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload
      }
    case CREATE_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      }
    case FETCH_PROJECT:
      return {
        ...state,
        project: {
          ...state.project,
          data: payload,
          loading: false
        }
      }
    case FETCH_PROJECT_JOBS:
      return {
        ...state,
        project: {
          ...state.project,
          jobs: {
            data: payload,
            loading: false,
            error: null
          }
        }
      }
    case FETCH_PROJECT_FUNCTIONS:
      return {
        ...state,
        project: {
          ...state.project,
          functions: {
            data: payload,
            loading: false,
            error: null
          }
        }
      }
    case FETCH_PROJECTS_BEGIN:
      return {
        ...state,
        loading: true
      }
    case FETCH_PROJECTS_FAILURE:
      return {
        ...state,
        projects: [],
        loading: false,
        error: payload
      }
    case FETCH_PROJECTS_SUCCESS:
      return {
        ...state,
        projects: payload,
        loading: false
      }
    case REMOVE_PROJECT:
      return {
        ...state,
        project: {
          data: null,
          loading: false,
          error: null,
          jobs: {
            data: null,
            loading: false,
            error: null
          },
          functions: {
            data: null,
            loading: false,
            error: null
          }
        }
      }
    case REMOVE_NEW_PROJECT:
      return {
        ...state,
        newProject: {
          name: '',
          description: ''
        }
      }
    case REMOVE_PROJECT_ERROR:
      return {
        ...state,
        error: null
      }
    case SET_NEW_PROJECT_DESCRIPTION:
      return {
        ...state,
        newProject: {
          ...state.newProject,
          description: payload
        }
      }
    case SET_NEW_PROJECT_NAME:
      return {
        ...state,
        newProject: {
          ...state.newProject,
          name: payload
        }
      }
    default:
      return state
  }
}
