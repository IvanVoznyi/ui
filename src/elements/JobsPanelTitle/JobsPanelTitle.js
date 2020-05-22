import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'

import JobsPanelTitleView from './JobsPanelTitleView'

import _, { isEmpty } from 'lodash'

import './jobsPanelTitle.scss'

const JobsPanelTitle = ({
  closePanel,
  functionsObject,
  match,
  openScheduleJob,
  setCurrentFunctionInfo,
  setOpenScheduleJob
}) => {
  const [isEdit, setIsEdit] = useState(false)
  const [currentFunction, setCurrentFunction] = useState({
    method: '',
    name: functionsObject.name || functionsObject.metadata.name,
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
    if (isEmpty(functionsObject.functions)) {
      return {
        versionOptions: [],
        methodOptions: []
      }
    }

    let versionOptions = functionsObject.functions
      .map(func => {
        return {
          label:
            (func.metadata.tag === 'latest' ? '$' : '') +
            (func.metadata.tag || '$latest'),
          id: func.metadata.tag || 'latest'
        }
      })
      .filter(item => item.label !== '')

    versionOptions =
      versionOptions.length === 0
        ? [{ label: '$latest', id: 'latest' }]
        : versionOptions

    let methodOptions = _.chain(functionsObject.functions)
      .map(func =>
        func.spec.entry_points ? Object.values(func.spec.entry_points) : []
      )
      .flatten()
      .map(entry_point => ({
        label: entry_point.name,
        id: entry_point.name,
        subLabel: entry_point.doc
      }))
      .uniqBy('label')
      .value()

    if (methodOptions.length === 1) {
      setCurrentFunction(prevState => ({
        ...prevState,
        method: methodOptions[0].id
      }))
    } else {
      const defaultMethod = functionsObject.functions.find(
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
  }, [functionsObject.functions])

  return (
    <JobsPanelTitleView
      closePanel={closePanel}
      currentFunction={currentFunction}
      handleEditJobTitle={handleEditJobTitle}
      isEdit={isEdit}
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
  functionsObject: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  openScheduleJob: PropTypes.bool.isRequired,
  setCurrentFunctionInfo: PropTypes.func.isRequired,
  setOpenScheduleJob: PropTypes.func.isRequired
}

export default JobsPanelTitle
