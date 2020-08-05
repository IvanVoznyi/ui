import React, { useState, useEffect } from 'react'
import Loader from '../../common/Loader/Loader'
import ProjectOverViewTable from '../ProjectOverViewTable/ProjectOverViewTable'

import projectsApi from '../../api/projects-api'

import measureTime from '../../utils/measureTime'
import { formatDatetime } from '../../utils/datetime'
import ProjectOverViewStatistics from '../ProjectOverViewStatistics/ProjectOverViewStatistics'

const JobsAndWorkflows = ({ match }) => {
  const [jobs, setJobs] = useState({
    data: null,
    error: null
  })

  const jobsStatistics = React.useMemo(() => {
    if (!jobs.data) return

    const jobsRunning = jobs.data.length
    const jobsFailed = jobs.data.reduce(
      (prev, curr) => (curr.status.state === 'error' ? (prev += 1) : prev),
      0
    )

    return {
      running: {
        value: jobsRunning,
        label: 'Running jobs',
        className: 'running',
        link: `/projects/${match.params.projectName}/jobs/monitor`
      },
      pipelines: {
        value: 0,
        label: 'Running pipelines',
        className: 'running',
        link: `/projects/${match.params.projectName}/jobs/monitor`
      },
      failed: {
        value: jobsFailed,
        label: 'Failed',
        className: 'default',
        link: `/projects/${match.params.projectName}/jobs/monitor`
      },
      scheduled: {
        value: 0,
        label: 'Scheduled',
        className: 'scheduled',
        link: `/projects/${match.params.projectName}/jobs/schedule`
      }
    }
  }, [jobs, match.params.projectName])

  const jobsTable = React.useMemo(() => {
    if (!jobs.data) return

    const tableBody = jobs.data.slice(0, 5).map(job => {
      return {
        name: {
          value: job.metadata.name,
          link: `/projects/${match.params.projectName}/jobs/${job.metadata.uid}/info`,
          className: 'table-cell_big'
        },
        type: {
          value: job.metadata.kind ?? '',
          class:
            'project-container__main-panel__table-body__row-value table-cell_small'
        },
        status: {
          value: job.status.state === 'error' ? 'failed' : job.status.state,
          className: 'table-cell_middle'
        },
        startTime: {
          value: formatDatetime(new Date(job.status.start_time)),
          className: 'table-cell_big'
        },
        duration: {
          value: measureTime(
            new Date(job.status.start_time),
            new Date(job.status.last_update)
          ),
          className: 'table-cell_small'
        }
      }
    })

    const tableHeader = [
      { value: 'Name', className: 'table-cell_big' },
      { value: 'Type', className: 'table-cell_small' },
      { value: 'Status', className: 'table-cell_middle' },
      { value: 'Started at', className: 'table-cell_big' },
      { value: 'Duration', className: 'table-cell_small' }
    ]

    return {
      header: tableHeader,
      body: tableBody
    }
  }, [jobs, match.params.projectName])

  useEffect(() => {
    let { request, cancelRequest } = projectsApi.getJobsAndWorkflows(
      match.params.projectName
    )

    request
      .then(({ data }) => {
        setJobs({ data: data.runs })
      })
      .catch(error => {
        if (!error.message) return //axios sends error when canceling request
        setJobs({ error: error.response.data })
      })

    return () => {
      cancelRequest()
    }
  }, [match.params.projectName])

  return (
    <div className="project-container__main-panel__jobs">
      <div className="project-container__main-panel__wrapper">
        <div className="project-container__main-panel__jobs-title">
          Jobs and Workflows
        </div>
        {jobs.data && (
          <div className="project-container__main-panel__statistics">
            <ProjectOverViewStatistics statistics={jobsStatistics} />
          </div>
        )}
      </div>
      {!jobs.data && !jobs.error ? (
        <Loader />
      ) : jobs.error ? (
        <div className="error_container">
          <h1>Sorry, something went wrong</h1>
        </div>
      ) : (
        <ProjectOverViewTable
          match={match}
          table={jobsTable}
          linktoAllItem={`projects/${match.params.projectName}/jobs/monitor`}
        />
      )}
    </div>
  )
}

export default React.memo(JobsAndWorkflows)
