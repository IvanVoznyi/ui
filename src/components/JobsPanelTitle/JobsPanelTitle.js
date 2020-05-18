import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'

import JobsPanelTitleView from './JobsPanelTitleView'

import { uniqBy, isEmpty, flattenDeep } from 'lodash'

import './jobsPanelTitle.scss'

const JobsPanelTitle = ({
  closePanel,
  func,
  handleEditJob,
  match,
  openScheduleJob,
  setOpenScheduleJob
}) => {
  const [isEdit, setIsEdit] = useState(false)
  const [functionVersion, setFunctionVersion] = useState('latest')
  const [functionName, setFunctionName] = useState(func.name)
  const [functionMethod, setFunctionMethod] = useState('')

  const handleEditJobTitle = () => {
    handleEditJob({
      method: functionMethod,
      name: functionName,
      version: functionVersion
    })
    setIsEdit(false)
  }

  const { methodOptions, versionOptions } = useMemo(() => {
    if (isEmpty(func.functions)) {
      return {
        versionOptions: [],
        methodOptions: []
      }
    }

    let versionOptions = func.functions
      .map(item => {
        return {
          label:
            item.metadata.tag === 'latest'
              ? `$${item.metadata.tag}`
              : item.metadata.tag,
          id: item.metadata.tag
        }
      })
      .filter(item => item.label !== '')

    versionOptions =
      versionOptions.length === 0
        ? [{ label: '$latest', id: 'latest' }]
        : versionOptions

    const arrayOfMethods = func.functions.map(item => {
      if (!item.spec.entry_points) {
        return []
      }

      return Object.keys(item.spec.entry_points).map(key => {
        return {
          name: item.spec.entry_points[key].name,
          doc: item.spec.entry_points[key].doc
        }
      })
    })

    const flattenArrayOfMethods = flattenDeep(arrayOfMethods)

    const uniqElementOfArrayMethodsByName = uniqBy(
      flattenArrayOfMethods,
      'name'
    )

    const methodOptions = uniqElementOfArrayMethodsByName.map(func => ({
      label: func.name,
      subLabel: func.doc,
      id: func.name
    }))

    if (methodOptions.length === 1) {
      setFunctionMethod(methodOptions[0].label)
    } else {
      const defaultMethod = func.functions.find(
        item => item.metadata.tag === 'latest'
      )?.spec.default_handler

      defaultMethod && setFunctionMethod(defaultMethod)
    }

    return {
      methodOptions,
      versionOptions
    }
  }, [func.functions])

  return (
    <JobsPanelTitleView
      closePanel={closePanel}
      func={func}
      functionMethod={functionMethod}
      functionName={functionName}
      functionVersion={functionVersion}
      handleEditJobTitle={handleEditJobTitle}
      isEdit={isEdit}
      match={match}
      methodOptions={methodOptions}
      openScheduleJob={openScheduleJob}
      setFunctionMethod={setFunctionMethod}
      setFunctionName={setFunctionName}
      setFunctionVersion={setFunctionVersion}
      setIsEdit={setIsEdit}
      setOpenScheduleJob={setOpenScheduleJob}
      versionOptions={versionOptions}
    />
  )
}

JobsPanelTitle.propTypes = {
  closePanel: PropTypes.func.isRequired,
  func: PropTypes.shape({}).isRequired,
  handleEditJob: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  openScheduleJob: PropTypes.bool.isRequired,
  setOpenScheduleJob: PropTypes.func.isRequired
}

export default JobsPanelTitle
