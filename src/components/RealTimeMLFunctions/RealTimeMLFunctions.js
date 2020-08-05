import React, { useEffect, useState, useMemo } from 'react'

import ProjectOverViewTable from '../ProjectOverViewTable/ProjectOverViewTable'
import ProjectOverViewStatistics from '../ProjectOverViewStatistics/ProjectOverViewStatistics'
import Loader from '../../common/Loader/Loader'

import projectsApi from '../../api/projects-api'

const RealTimeMLFunction = ({ match }) => {
  const [functions, setFunction] = useState({
    data: null,
    error: null
  })

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
    let { request, cancelRequest } = projectsApi.getProjectFunctions(
      match.params.projectName
    )

    request
      .then(({ data }) => {
        setFunction({ data: data.funcs })
      })
      .catch(error => {
        if (!error.message) return //axios sends error when canceling request
        setFunction({ error: error.response.data })
      })
    return () => {
      cancelRequest()
    }
  }, [match.params.projectName])

  return (
    <div className="project-container__main-panel__functions">
      <div className="project-container__main-panel__wrapper">
        <div className="project-container__main-panel__functions-title">
          Real-Time and ML functions
        </div>
        {functions.data && (
          <div className="project-container__main-panel__statistics">
            <ProjectOverViewStatistics statistics={functionsStatistics} />
          </div>
        )}
      </div>
      {!functions.data && !functions.error ? (
        <Loader />
      ) : functions.error ? (
        <div className="error_container">
          <h1>Sorry, something went wrong</h1>
        </div>
      ) : (
        <ProjectOverViewTable
          match={match}
          table={functionsTable}
          linktoAllItem={`projects/${match.params.projectName}/functions`}
        />
      )}
    </div>
  )
}

export default RealTimeMLFunction
