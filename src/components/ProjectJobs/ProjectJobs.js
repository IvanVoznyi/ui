import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import Loader from '../../common/Loader/Loader'
import ProjectTable from '../ProjectTable/ProjectTable'
import ProjectStatistics from '../../elements/ProjectStatistics/ProjectStatistics'
import NoData from '../../common/NoData/NoData'

import { getJobsStatistics, getJobsTableData } from './projectJobs.utils'

const ProjectJobs = ({ match, jobs, fetchProjectJobs }) => {
  useEffect(() => {
    fetchProjectJobs(match.params.projectName)
  }, [match.params.projectName, fetchProjectJobs])

  const jobsData = React.useMemo(() => {
    const statistics = getJobsStatistics(jobs, match)
    const table = getJobsTableData(jobs, match)
    return {
      statistics,
      table
    }
  }, [jobs, match])

  return (
    <div className="project__main-info__jobs">
      <div className="project__main-info__wrapper">
        <div className="project__main-info__jobs-title data-ellipsis">
          Jobs and Workflows
        </div>
        {!isEmpty(jobs.data) && (
          <div className="project__main-info__statistics">
            <ProjectStatistics statistics={jobsData.statistics} />
          </div>
        )}
      </div>
      {jobs.loading ? (
        <Loader />
      ) : jobs.error ? (
        <div className="error_container">
          <h1>{jobs.error}</h1>
        </div>
      ) : isEmpty(jobs.data) ? (
        <NoData />
      ) : (
        <ProjectTable
          match={match}
          table={jobsData.table}
          seeAllLink={`/projects/${match.params.projectName}/jobs/monitor`}
        />
      )}
    </div>
  )
}

ProjectJobs.propTypes = {
  fetchProjectJobs: PropTypes.func.isRequired,
  jobs: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired
}

export default React.memo(ProjectJobs)
