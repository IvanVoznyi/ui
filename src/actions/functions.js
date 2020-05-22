import functionsApi from '../api/functions-api'
import yaml from 'js-yaml'
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

const functionsActions = {
  fetchFunctions: project => dispatch => {
    dispatch(functionsActions.fetchFunctionsBegin())

    return functionsApi
      .getAll(project)
      .then(({ data }) => {
        dispatch(functionsActions.fetchFunctionsSuccess(data.funcs))

        return data.funcs
      })
      .catch(err => dispatch(functionsActions.fetchFunctionsFailure(err)))
  },
  fetchFunctionsBegin: () => ({
    type: FETCH_FUNCTIONS_BEGIN
  }),
  fetchFunctionsSuccess: jobsList => ({
    type: FETCH_FUNCTIONS_SUCCESS,
    payload: jobsList
  }),
  fetchFunctionsFailure: error => ({
    type: FETCH_FUNCTIONS_FAILURE,
    payload: error
  }),
  fetchFunctionsTemplates: () => dispatch => {
    return functionsApi
      .getFunctionTemplatesCatalog()
      .then(result => {
        const templates = Object.keys(result.data).map(func => {
          return {
            metadata: {
              name: func,
              hash: '',
              description: result.data[func].description,
              categories: result.data[func].categories,
              versions: result.data[func].versions,
              tag: ''
            },
            status: {
              status: ''
            }
          }
        })

        dispatch(functionsActions.setFunctionsTemplates(templates))

        return templates
      })
      .catch(error => dispatch(functionsActions.fetchJobLogsFailure(error)))
  },
  fetchSelectFunction: path => dispatch => {
    dispatch(functionsActions.fetchSelectFunctionBegin())
    return functionsApi
      .getFunctionTemplate(path)
      .then(response => {
        let parsedData = yaml.safeLoad(response.data)
        dispatch(
          functionsActions.fetchSelectFunctionSuccess({
            name: parsedData.metadata.name,
            functions: parsedData.spec.entry_point ? [] : [parsedData]
          })
        )
      })
      .catch(err => dispatch(functionsActions.fetchSelectFunctionFailure(err)))
  },
  fetchSelectFunctionSuccess: selectFunction => ({
    type: FETCH_SELECT_FUNCTION_SUCCESS,
    payload: selectFunction
  }),
  fetchSelectFunctionBegin: () => ({
    type: FETCH_SELECT_FUNCTION_BEGIN
  }),
  fetchSelectFunctionFailure: err => ({
    type: FETCH_SELECT_FUNCTION_FAILURE,
    payload: err
  }),
  removeSelectFunction: () => ({
    type: REMOVE_SELECT_FUNCTION
  }),
  setFunctionsTemplates: templates => ({
    type: SET_FUNCTIONS_TEMPLATES,
    payload: templates
  })
}

export default functionsActions
