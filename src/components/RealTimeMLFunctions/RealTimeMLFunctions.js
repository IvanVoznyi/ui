import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import ProjectTable from '../ProjectTable/ProjectTable'
import ProjectStatistics from '../ProjectStatistics/ProjectStatistics'
import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'

const RealTimeMLFunction = ({ fetchProjectFunctions, functions, match }) => {
  const functionsStatistics = useMemo(() => {
    if (!functions.data) return
    const totalFunction = functions.data.length

    return {
      ml: {
        value: totalFunction,
        label: 'ML',
        className: 'default',
        link: `/projects/${match.params.projectName}/functions`
      }
    }
  }, [functions, match.params.projectName])

  const functionsTable = useMemo(() => {
    if (!functions.data) return

    const functionsTableHeader = [
      {
        value: 'Name',
        className: 'table-cell_big'
      },
      { value: 'Type', className: 'table-cell_small' },
      { value: 'Status', className: 'table-cell_small' }
    ]

    const functionsTableBody = functions.data.slice(0, 5).map(func => {
      return {
        name: {
          value: func.metadata.name,
          link: `/projects/${match.params.projectName}/functions/${func.metadata.hash}/info`,
          className: 'table-cell_big'
        },
        type: {
          value: func.metadata.kind ?? '',
          class:
            'project-container__main-panel__table-body__row-value table-cell_small'
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
  }, [functions, match.params.projectName])

  useEffect(() => {
    fetchProjectFunctions(match.params.projectName)
  }, [match.params.projectName, fetchProjectFunctions])

  return (
    <div className="project-container__main-panel__functions">
      <div className="project-container__main-panel__wrapper">
        <div className="project-container__main-panel__functions-title data-ellipsis">
          Real-Time and ML functions
        </div>
        {!_.isEmpty(functions.data) && (
          <div className="project-container__main-panel__statistics">
            <ProjectStatistics statistics={functionsStatistics} />
          </div>
        )}
      </div>
      {functions.loading ? (
        <Loader />
      ) : functions.error ? (
        <div className="error_container">
          <h1>{functions.error}</h1>
        </div>
      ) : _.isEmpty(functions.data) ? (
        <NoData />
      ) : (
        <ProjectTable
          match={match}
          table={functionsTable}
          linkAllItem={`/projects/${match.params.projectName}/functions`}
        />
      )}
    </div>
  )
}

RealTimeMLFunction.propTypes = {
  fetchProjectFunctions: PropTypes.func.isRequired,
  functions: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired
}

export default React.memo(RealTimeMLFunction)
