import projectsApi from '../api/projects-api'
import {
  FETCH_PROJECTS_BEGIN,
  FETCH_PROJECTS_FAILURE,
  FETCH_PROJECTS_SUCCESS,
  CREATE_PROJECT_BEGIN,
  CREATE_PROJECT_SUCCESS,
  CREATE_PROJECT_FAILURE,
  REMOVE_NEW_PROJECT,
  SET_NEW_PROJECT_NAME,
  SET_NEW_PROJECT_DESCRIPTION,
  REMOVE_PROJECT_ERROR
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
  fetchProjects: () => dispatch => {
    dispatch(projectsAction.fetchProjectsBegin())
    return projectsApi
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
  removeProjectError: () => ({ type: REMOVE_PROJECT_ERROR }),
  setNewProjectDescription: description => ({
    type: SET_NEW_PROJECT_DESCRIPTION,
    payload: description
  }),
  setNewProjectName: name => ({ type: SET_NEW_PROJECT_NAME, payload: name })
}

export default projectsAction
