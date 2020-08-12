import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import ProjectTable from '../ProjectTable/ProjectTable'
import ProjectStatistics from '../../elements/ProjectStatistics/ProjectStatistics'
import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'
import { Link } from 'react-router-dom'

const ProjectFunctions = ({ fetchProjectFunctions, functionsStore, match }) => {
  useEffect(() => {
    fetchProjectFunctions(match.params.projectName)
  }, [match.params.projectName, fetchProjectFunctions])

  const functions = useMemo(() => {
    if (!functionsStore.data) return
    const functionsCount = functionsStore.data.length

    return {
      data: {
        value: functionsCount,
        label: 'ML',
        className: 'default',
        link: `/projects/${match.params.projectName}/functions`
      }
    }
  }, [functionsStore, match.params.projectName])

  const functionsTable = useMemo(() => {
    if (!functionsStore.data) return

    const functionsTableHeader = [
      {
        value: 'Name',
        className: 'table-cell_big'
      },
      { value: 'Type', className: 'table-cell_small' },
      { value: 'Status', className: 'table-cell_small' }
    ]

    const functionsTableBody = functionsStore.data.slice(0, 5).map(func => {
      return {
        name: {
          value: func.metadata.name,
          link: `/projects/${match.params.projectName}/functions/${func.metadata.hash}/info`,
          className: 'table-cell_big'
        },
        type: {
          value: func.metadata.kind ?? '',
          class: 'project-data-card__table-body-row__cell table-cell_small'
        },
        status: {
          value: func?.status?.state ?? '',
          className: 'table-cell_small'
        }
      }
    })

    return {
      header: functionsTableHeader,
      body: functionsTableBody
    }
  }, [functionsStore, match.params.projectName])

  return (
    <div className="project-data-card">
      <div className="project-data-card__header">
        <div className="project-data-card__title data-ellipsis">
          Real-Time and ML functions
        </div>
        {!isEmpty(functionsStore.data) && (
          <div className="project-data-card__statistics">
            <ProjectStatistics statistics={functions} />
          </div>
        )}
      </div>
      {functionsStore.loading ? (
        <Loader />
      ) : functionsStore.error ? (
        <div className="error_container">
          <h1>{functionsStore.error}</h1>
        </div>
      ) : isEmpty(functionsStore.data) ? (
        <NoData />
      ) : (
        <>
          <ProjectTable match={match} table={functionsTable} />
          <Link
            className="project-data-card__see-all-link"
            to={`/projects/${match.params.projectName}/functions`}
          >
            See all
          </Link>
        </>
      )}
    </div>
  )
}

ProjectFunctions.propTypes = {
  fetchProjectFunctions: PropTypes.func.isRequired,
  functionsStore: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired
}

export default React.memo(ProjectFunctions)
