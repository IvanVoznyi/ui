import projectsApi from '../api/projects-api'
import {
  CREATE_PROJECT_BEGIN,
  CREATE_PROJECT_FAILURE,
  CREATE_PROJECT_SUCCESS,
  FETCH_PROJECT,
  FETCH_PROJECTS_BEGIN,
  FETCH_PROJECTS_FAILURE,
  FETCH_PROJECTS_SUCCESS,
  FETCH_PROJECT_FUNCTIONS,
  FETCH_PROJECT_JOBS,
  PROJECT_ERROR,
  PROJECT_FUNCTIONS_ERROR,
  PROJECT_FUNCTIONS_LOADING,
  PROJECT_JOBS_ERROR,
  PROJECT_JOBS_LOADING,
  PROJECT_LOADING,
  REMOVE_NEW_PROJECT,
  REMOVE_PROJECT,
  REMOVE_PROJECT_ERROR,
  SET_NEW_PROJECT_DESCRIPTION,
  SET_NEW_PROJECT_NAME
} from '../constants'

const projectsAction = {
  createNewProject: postData => dispatch => {
    dispatch(projectsAction.createProjectBegin())
    return projectsApi
      .createProject(postData)
      .then(result => {
        dispatch(projectsAction.createProjectSuccess())
        return result
      })
      .catch(error => {
        dispatch(projectsAction.createProjectFailure(error.message))
      })
  },
  createProjectBegin: () => ({ type: CREATE_PROJECT_BEGIN }),
  createProjectFailure: error => ({
    type: CREATE_PROJECT_FAILURE,
    payload: error
  }),
  createProjectSuccess: () => ({ type: CREATE_PROJECT_SUCCESS }),
  fetchProject: project => dispatch => {
    dispatch({ type: PROJECT_LOADING })

    projectsApi
      .getProject(project)
      .then(({ data }) => {
        dispatch({
          type: FETCH_PROJECT,
          payload: data.project
        })
      })
      .catch(error => {
        if (!error.message) return //axios sends error when canceling request
        dispatch({
          type: PROJECT_ERROR,
          payload: error.message
        })
      })
  },
  fetchProjectJobs: project => dispatch => {
    dispatch({ type: PROJECT_JOBS_LOADING })
    projectsApi
      .getJobsAndWorkflows(project)
      .then(({ data }) => {
        dispatch({
          type: FETCH_PROJECT_JOBS,
          payload: data.runs
        })
      })
      .catch(error => {
        if (!error.message) return //axios sends error when canceling request
        dispatch({
          type: PROJECT_JOBS_ERROR,
          payload: error.message
        })
      })
  },
  fetchProjectFunctions: project => dispatch => {
    dispatch({ type: PROJECT_FUNCTIONS_LOADING })

    projectsApi
      .getProjectFunctions(project)
      .then(({ data }) => {
        dispatch({
          type: FETCH_PROJECT_FUNCTIONS,
          payload: data.funcs
        })
      })
      .catch(error => {
        if (!error.message) return //axios sends error when canceling request
        dispatch({
          type: PROJECT_FUNCTIONS_ERROR,
          payload: error.message
        })
      })
  },
  fetchProjects: () => dispatch => {
    dispatch(projectsAction.fetchProjectsBegin())
    projectsApi
      .getProjects()
      .then(response => {
        dispatch(projectsAction.fetchProjectsSuccess(response.data.projects))
      })
      .catch(err => {
        dispatch(projectsAction.fetchProjectsFailure(err))
      })
  },
  fetchProjectsBegin: () => ({ type: FETCH_PROJECTS_BEGIN }),
  fetchProjectsFailure: error => ({
    type: FETCH_PROJECTS_FAILURE,
    payload: error
  }),
  fetchProjectsSuccess: artifactsList => ({
    type: FETCH_PROJECTS_SUCCESS,
    payload: artifactsList
  }),
  removeNewProject: () => ({ type: REMOVE_NEW_PROJECT }),
  removeProject: () => ({ type: REMOVE_PROJECT }),
  removeProjectError: () => ({ type: REMOVE_PROJECT_ERROR }),
  setNewProjectDescription: description => ({
    type: SET_NEW_PROJECT_DESCRIPTION,
    payload: description
  }),
  setNewProjectName: name => ({ type: SET_NEW_PROJECT_NAME, payload: name })
}

export default projectsAction
