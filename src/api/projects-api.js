import { mainHttpClient } from '../httpClient'
import axios from 'axios'

const request = url => {
  let cancelRequest

  let request = mainHttpClient.get(url, {
    cancelToken: new axios.CancelToken(c => {
      cancelRequest = c
    })
  })
  return {
    request,
    cancelRequest
  }
}

export default {
  getProjects: () => mainHttpClient.get('/projects?full=yes'),
  createProject: postData => mainHttpClient.post('/project', postData),
  getProject: project => request(`/project/${project}`),
  editProject: (project, data) =>
    mainHttpClient.post(`/project/${project}`, data),
  getJobsAndWorkflows: project => request(`/runs?project=${project}`),
  getProjectFunctions: project => request(`/funcs?project=${project}`)
}
