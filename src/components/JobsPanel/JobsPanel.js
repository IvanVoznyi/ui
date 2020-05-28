import React, { useState, useLayoutEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'

import JobsPanelView from './JobsPanelView'

import jobsActions from '../../actions/jobs'
import functionActions from '../../actions/functions'
import { parseJobsDefaultParameters } from '../../utils/object'

import _ from 'lodash'

import './jobsPanel.scss'

const JobsPanel = ({
  closePanel,
  fetchFunctionTemplate,
  functionsStore,
  groupedFunctions,
  jobsStore,
  match,
  removeFunctionTemplate,
  runNewJob,
  setNewJob,
  setNewJobHyperParameters,
  setNewJobInputs,
  setNewJobParameters,
  setNewJobVolumeMounts,
  setNewJobVolumes
}) => {
  const [openScheduleJob, setOpenScheduleJob] = useState(false)
  const [inputPath, setInputPath] = useState('')
  const [outputPath, setOutputPath] = useState('')
  const [requests, setRequests] = useState({
    cpu: '',
    memory: ''
  })
  const [memoryUnit, setMemoryUnit] = useState('')

  const [limits, setLimits] = useState({
    cpu: '',
    memory: '',
    nvidia_gpu: ''
  })
  const [cpuUnit, setCpuUnit] = useState('')
  const [currentFunctionInfo, setCurrentFunctionInfo] = useState({
    name: '',
    version: '',
    method: ''
  })

  const history = useHistory()

  useLayoutEffect(() => {
    if (!groupedFunctions.name && !functionsStore.selectedFunction.name) {
      fetchFunctionTemplate(groupedFunctions.metadata.versions.latest)
    }
    return () =>
      functionsStore.selectedFunction.name && removeFunctionTemplate()
  }, [
    fetchFunctionTemplate,
    functionsStore,
    groupedFunctions,
    removeFunctionTemplate
  ])

  const functionDefaultValues = useMemo(() => {
    let functionDefaultData = {}
    if (groupedFunctions.name || functionsStore.selectedFunction.name) {
      functionDefaultData = _.chain(
        groupedFunctions.functions || functionsStore.selectedFunction.functions
      )
        .map(func =>
          _.map(func.spec.entry_points, entry_points => entry_points.parameters)
        )
        .flattenDeep()
        .uniqBy('name')
        .value()
    }

    if (Object.values(functionDefaultData).length > 0) {
      let parameters = functionDefaultData
        .filter(parameter => parameter.type !== 'DataItem')
        .map(parameter => ({
          doc: parameter.doc,
          isValueEmpty: parameter.default ? false : true,
          isDefault: true,
          items: {
            name: parameter.name ?? '',
            type: parameter.type ?? '',
            value: parameter.default ?? '',
            simple: ''
          }
        }))

      if (parameters.length > 0) {
        parseJobsDefaultParameters(parameters, setNewJobParameters)
      }

      let dataInputs = functionDefaultData
        .filter(dataInputs => dataInputs.type === 'DataItem')
        .map(input => ({
          doc: input.doc,
          isValueEmpty: input.path ? false : true,
          isDefault: true,
          items: {
            name: input.name,
            path: input.path ?? ''
          }
        }))

      if (dataInputs.length > 0) {
        parseJobsDefaultParameters(dataInputs, setNewJobInputs)
      }

      return {
        parameters,
        dataInputs
      }
    }
    return {
      parameters: [],
      dataInputs: []
    }
  }, [groupedFunctions, setNewJobInputs, setNewJobParameters, functionsStore])

  const handleRunJob = () => {
    let selectedFunction = groupedFunctions.functions.find(
      func => func.metadata.tag === currentFunctionInfo.version
    )

    const postData = {
      schedule: jobsStore.newJob.schedule,
      ...jobsStore.newJob,
      function: {
        ...jobsStore.newJob.function,
        spec: {
          ...jobsStore.newJob.function.spec,
          resources: {
            limits: limits,
            requests: requests
          }
        }
      },
      task: {
        ...jobsStore.newJob.task,
        spec: {
          ...jobsStore.newJob.task.spec,
          output_path: outputPath,
          input_path: inputPath,
          function: `${match.params.projectName}/${selectedFunction.metadata.name}:${selectedFunction.metadata.hash}`
        }
      }
    }

    runNewJob(postData).then(() => {
      setNewJob({
        task: {
          spec: {
            parameters: {},
            inputs: {},
            hyperparams: {}
          }
        },
        function: {
          spec: {
            volumes: [],
            volumeMounts: []
          }
        }
      })

      history.push(`/projects/${match.params.projectName}/jobs`)
    })
  }

  return (
    <JobsPanelView
      closePanel={closePanel}
      cpuUnit={cpuUnit}
      functionsData={
        functionsStore.selectedFunction.name
          ? functionsStore.selectedFunction
          : groupedFunctions
      }
      functionDefaultValues={functionDefaultValues}
      handleRunJob={handleRunJob}
      jobsStore={jobsStore}
      limits={limits}
      match={match}
      memoryUnit={memoryUnit}
      openScheduleJob={openScheduleJob}
      requests={requests}
      setCpuUnit={setCpuUnit}
      setCurrentFunctionInfo={setCurrentFunctionInfo}
      setInputPath={setInputPath}
      setLimits={setLimits}
      setMemoryUnit={setMemoryUnit}
      setNewJobHyperParameters={setNewJobHyperParameters}
      setNewJobInputs={setNewJobInputs}
      setNewJobParameters={setNewJobParameters}
      setNewJobVolumeMounts={setNewJobVolumeMounts}
      setNewJobVolumes={setNewJobVolumes}
      setOpenScheduleJob={setOpenScheduleJob}
      setOutputPath={setOutputPath}
      setRequests={setRequests}
    />
  )
}

JobsPanel.propTypes = {
  closePanel: PropTypes.func.isRequired,
  groupedFunctions: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  runNewJob: PropTypes.func.isRequired,
  setNewJob: PropTypes.func.isRequired,
  setNewJobHyperParameters: PropTypes.func.isRequired,
  setNewJobInputs: PropTypes.func.isRequired,
  setNewJobParameters: PropTypes.func.isRequired,
  setNewJobVolumeMounts: PropTypes.func.isRequired,
  setNewJobVolumes: PropTypes.func.isRequired
}

export default connect(
  ({ jobsStore, functionsStore }) => ({ jobsStore, functionsStore }),
  { ...jobsActions, ...functionActions }
)(JobsPanel)
