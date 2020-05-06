import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'

import JobsPanelView from './JobsPanelView'

import jobsActions from '../../actions/jobs'

import './jobsPanel.scss'

const JobsPanel = ({
  close,
  func,
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
  const [initialJobInfo, setInitialJobInfo] = useState({
    name: '',
    version: '',
    method: ''
  })

  const history = useHistory()

  const handleInitialJobInfo = data => {
    setInitialJobInfo(data)
  }

  const handleRunJob = () => {
    let selectedFunction = func.functions.find(
      item => item.metadata.tag === initialJobInfo.version
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
      close={close}
      cpuUnit={cpuUnit}
      func={func}
      handleInitialJobInfo={handleInitialJobInfo}
      handleRunJob={handleRunJob}
      jobsStore={jobsStore}
      limits={limits}
      match={match}
      memoryUnit={memoryUnit}
      openScheduleJob={openScheduleJob}
      requests={requests}
      setCpuUnit={setCpuUnit}
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
  close: PropTypes.func.isRequired,
  func: PropTypes.shape({}).isRequired,
  jobsStore: PropTypes.shape({}).isRequired,
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
