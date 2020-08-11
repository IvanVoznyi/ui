import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import Loader from '../../common/Loader/Loader'
import ProjectTable from '../ProjectTable/ProjectTable'
import ProjectStatistics from '../../elements/ProjectStatistics/ProjectStatistics'
import NoData from '../../common/NoData/NoData'

import { getJobsStatistics, getJobsTableData } from './projectJobs.utils'
import { Link } from 'react-router-dom'

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
    <div className="project-data-card">
      <div className="project-data-card__header">
        <div className="project-data-card__header__title data-ellipsis">
          Jobs and Workflows
        </div>
        {!isEmpty(jobs.data) && (
          <div className="project-data-card__statistics">
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
        <>
          <ProjectTable match={match} table={jobsData.table} />
          <Link
            className="project-data-card__link-all"
            to={`/projects/${match.params.projectName}/jobs/monitor`}
          >
            See all
          </Link>
        </>
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
