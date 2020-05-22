import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect, useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import JobsPanelView from './JobsPanelView'

import jobsActions from '../../actions/jobs'
import functionActions from '../../actions/functions'

import './jobsPanel.scss'
import functionsActions from '../../actions/functions'

const JobsPanel = ({
  closePanel,
  groupedFunctions,
  jobsStore,
  match,
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

  const dispatchSelectFunction = useDispatch()
  const { selectedFunction, loading } = useSelector(
    state => state.functionsStore
  )

  useEffect(() => {
    if (!selectedFunction.name) {
      dispatchSelectFunction(
        functionActions.fetchSelectFunction(
          groupedFunctions.metadata.versions.latest
        )
      )
    }
    return () =>
      selectedFunction.name &&
      dispatchSelectFunction(functionsActions.removeSelectFunction())
  }, [groupedFunctions, dispatchSelectFunction, selectedFunction])

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
      handleRunJob={handleRunJob}
      isLoading={loading}
      jobsStore={jobsStore}
      limits={limits}
      match={match}
      memoryUnit={memoryUnit}
      objectFunctions={
        selectedFunction.name ? selectedFunction : groupedFunctions
      }
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

export default connect(jobsStore => jobsStore, jobsActions)(JobsPanel)
