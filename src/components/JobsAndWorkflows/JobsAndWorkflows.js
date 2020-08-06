import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Loader from '../../common/Loader/Loader'
import ProjectTable from '../ProjectTable/ProjectTable'
import _ from 'lodash'

import measureTime from '../../utils/measureTime'
import { formatDatetime } from '../../utils/datetime'
import ProjectStatistics from '../ProjectStatistics/ProjectStatistics'
import NoData from '../../common/NoData/NoData'

const JobsAndWorkflows = ({ fetchProjectJobs, jobs, match }) => {
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
    let cancelRequest = fetchProjectJobs(match.params.projectName)

    return () => {
      cancelRequest()
    }
  }, [match.params.projectName, fetchProjectJobs])

  return (
    <div className="project-container__main-panel__jobs">
      <div className="project-container__main-panel__wrapper">
        <div className="project-container__main-panel__jobs-title">
          Jobs and Workflows
        </div>
        {!_.isEmpty(jobs.data) && (
          <div className="project-container__main-panel__statistics">
            <ProjectStatistics statistics={jobsStatistics} />
          </div>
        )}
      </div>
      {jobs.loading ? (
        <Loader />
      ) : jobs.error ? (
        <div className="error_container">
          <h1>{jobs.error}</h1>
        </div>
      ) : _.isEmpty(jobs.data) ? (
        <NoData />
      ) : (
        <ProjectTable
          match={match}
          table={jobsTable}
          linkAllItem={`projects/${match.params.projectName}/jobs/monitor`}
        />
      )}
    </div>
  )
}

JobsAndWorkflows.propTypes = {
  fetchProjectJobs: PropTypes.func.isRequired,
  jobs: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired
}

export default JobsAndWorkflows
