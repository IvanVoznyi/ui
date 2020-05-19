import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'

import JobsPanelTitleView from './JobsPanelTitleView'

import { isEmpty, unionBy, map } from 'lodash'

import './jobsPanelTitle.scss'

const JobsPanelTitle = ({
  closePanel,
  handleCurrentEditFunc,
  listOfFunctions,
  match,
  openScheduleJob,
  setOpenScheduleJob
}) => {
  const [isEdit, setIsEdit] = useState(false)
  const [currentFunction, setCurrentFunction] = useState({
    method: '',
    name: listOfFunctions.name || listOfFunctions.metadata.name,
    version: 'latest'
  })

  const handleEditJobTitle = () => {
    handleCurrentEditFunc({
      method: currentFunction.method,
      name: currentFunction.name,
      version: currentFunction.version
    })
    setIsEdit(false)
  }

  const handleCurrentFunction = prop => {
    setCurrentFunction(prevState => ({
      ...prevState,
      ...prop
    }))
  }

  const { methodOptions, versionOptions } = useMemo(() => {
    if (isEmpty(listOfFunctions.functions)) {
      return {
        versionOptions: [],
        methodOptions: []
      }
    }

    let versionOptions = listOfFunctions.functions
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

    let methodOptions = unionBy(
      map(listOfFunctions.functions, 'spec.entry_points').flatMap(
        objectOfMethods =>
          map(objectOfMethods, method => ({
            label: method.name,
            id: method.name,
            subLabel: method.doc
          }))
      ),
      'label'
    )

    if (methodOptions.length === 1) {
      setCurrentFunction(prevState => ({
        ...prevState,
        method: methodOptions[0].id
      }))
    } else {
      const defaultMethod = listOfFunctions.functions.find(
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
  }, [listOfFunctions.functions])

  return (
    <JobsPanelTitleView
      closePanel={closePanel}
      currentFunction={currentFunction}
      handleCurrentFunction={handleCurrentFunction}
      handleEditJobTitle={handleEditJobTitle}
      isEdit={isEdit}
      listOfFunctions={listOfFunctions}
      match={match}
      methodOptions={methodOptions}
      openScheduleJob={openScheduleJob}
      setIsEdit={setIsEdit}
      setOpenScheduleJob={setOpenScheduleJob}
      versionOptions={versionOptions}
    />
  )
}

JobsPanelTitle.propTypes = {
  closePanel: PropTypes.func.isRequired,
  handleCurrentEditFunc: PropTypes.func.isRequired,
  listOfFunctions: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  openScheduleJob: PropTypes.bool.isRequired,
  setOpenScheduleJob: PropTypes.func.isRequired
}

export default JobsPanelTitle
