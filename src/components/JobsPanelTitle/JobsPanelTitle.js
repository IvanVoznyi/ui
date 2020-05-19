import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'

import JobsPanelTitleView from './JobsPanelTitleView'

import { isEmpty, map, reduce } from 'lodash'

import './jobsPanelTitle.scss'

const JobsPanelTitle = ({
  closePanel,
  groupedFunctions,
  match,
  openScheduleJob,
  setCurrentFunctionInfo,
  setOpenScheduleJob
}) => {
  const [isEdit, setIsEdit] = useState(false)
  const [currentFunction, setCurrentFunction] = useState({
    method: '',
    name: groupedFunctions.name || groupedFunctions.metadata.name,
    version: 'latest'
  })

  const handleEditJobTitle = () => {
    setCurrentFunctionInfo({
      method: currentFunction.method,
      name: currentFunction.name,
      version: currentFunction.version
    })
    setIsEdit(false)
  }

  const { methodOptions, versionOptions } = useMemo(() => {
    if (isEmpty(groupedFunctions.functions)) {
      return {
        versionOptions: [],
        methodOptions: []
      }
    }

    let versionOptions = groupedFunctions.functions
      .map(func => {
        return {
          label:
            (func.metadata.tag === 'latest' ? '$' : '') + func.metadata.tag,
          id: func.metadata.tag
        }
      })
      .filter(item => item.label !== '')

    versionOptions =
      versionOptions.length === 0
        ? [{ label: '$latest', id: 'latest' }]
        : versionOptions

    let ObjectOfMethods = reduce(
      groupedFunctions.functions,
      (prev, curr) => {
        return {
          ...prev,
          ...map(curr.spec.entry_points, method => ({
            label: method.name,
            id: method.name,
            subLabel: method.doc
          }))
        }
      },
      {}
    )

    let methodOptions = map(ObjectOfMethods, method => ({ ...method }))

    if (methodOptions.length === 1) {
      setCurrentFunction(prevState => ({
        ...prevState,
        method: methodOptions[0].id
      }))
    } else {
      const defaultMethod = groupedFunctions.functions.find(
        item => item.metadata.tag === 'latest'
      )?.spec.default_handler

      defaultMethod &&
        setCurrentFunction(prevState => ({
          ...prevState,
          method: defaultMethod
        }))
    }

    return {
      methodOptions,
      versionOptions
    }
  }, [groupedFunctions.functions])

  return (
    <JobsPanelTitleView
      closePanel={closePanel}
      currentFunction={currentFunction}
      handleEditJobTitle={handleEditJobTitle}
      isEdit={isEdit}
      listOfFunctions={groupedFunctions}
      match={match}
      methodOptions={methodOptions}
      openScheduleJob={openScheduleJob}
      setCurrentFunction={setCurrentFunction}
      setIsEdit={setIsEdit}
      setOpenScheduleJob={setOpenScheduleJob}
      versionOptions={versionOptions}
    />
  )
}

JobsPanelTitle.propTypes = {
  closePanel: PropTypes.func.isRequired,
  groupedFunctions: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  openScheduleJob: PropTypes.bool.isRequired,
  setCurrentFunctionInfo: PropTypes.func.isRequired,
  setOpenScheduleJob: PropTypes.func.isRequired
}

export default JobsPanelTitle
