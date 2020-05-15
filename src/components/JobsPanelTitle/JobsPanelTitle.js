import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'

import Select from '../../common/Select/Select'
import Input from '../../common/Input/Input'

import { ReactComponent as BackArrow } from '../../images/back-arrow.svg'
import { ReactComponent as Close } from '../../images/close.svg'
import { ReactComponent as Edit } from '../../images/edit.svg'

import { uniqBy, isEmpty } from 'lodash'

import './jobsPanelTitle.scss'

const JobsPanelTitle = ({
  close,
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
        versionOptions: '',
        methodOptions: ''
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

    const methodOptions = uniqBy(
      func.functions
        .map(item => {
          let methodObject = []
          for (const key in item.spec.entry_points) {
            if (
              Object.prototype.hasOwnProperty.call(item.spec.entry_points, key)
            ) {
              methodObject.push({
                name: item.spec.entry_points[key].name,
                doc: item.spec.entry_points[key].doc
              })
            }
          }
          return methodObject
        })
        .reduce((prev, curr) => {
          return [...prev, ...curr]
        }, []),
      item => item.name
    ).map(item => ({
      label: item.name,
      subLabel: item.doc,
      id: item.name
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
    <div className="job-panel__title">
      <div
        className={`job-panel__title-wrapper ${isEdit &&
          'job-panel__title-wrapper_width'}`}
      >
        {openScheduleJob && (
          <div className="job-schedule-container">
            <BackArrow onClick={() => setOpenScheduleJob(false)} />
            <span className="job-schedule__title">Schedule Job</span>
          </div>
        )}
        {!isEdit && (
          <div
            className={`job-panel__container ${openScheduleJob !== true &&
              isEdit !== true &&
              'job-panel__container_hover'}`}
          >
            <div className="job-panel__name-wrapper">
              <div className="job-panel__name">
                {functionName || func?.metadata?.name}
              </div>
              {!openScheduleJob && (
                <div className="job-panel__container">
                  <div className="job-panel__version">
                    Version: {functionVersion === 'latest' && '$'}
                    {functionVersion}
                  </div>
                  {functionMethod && (
                    <div className="job-panel__method">
                      Method: {functionMethod}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="job-panel__edit">
              <Edit
                className="job-panel__icon"
                onClick={() => {
                  setIsEdit(true)
                }}
              />
            </div>
          </div>
        )}
        {isEdit && (
          <>
            <Input
              onChange={setFunctionName}
              type="string"
              value={functionName}
            />
            <div className="job-panel__select-container">
              <Select
                className={methodOptions.length !== 0 ? 'select_left' : ''}
                label="Version"
                floatingLabel
                match={match}
                onClick={setFunctionVersion}
                options={versionOptions}
                value={functionVersion}
              />
              {methodOptions.length !== 0 && (
                <Select
                  label="Method"
                  match={match}
                  floatingLabel
                  onClick={setFunctionMethod}
                  options={methodOptions}
                  value={functionMethod}
                />
              )}
            </div>
            <button className="btn btn_primary" onClick={handleEditJobTitle}>
              Done
            </button>
          </>
        )}
      </div>
      <button onClick={() => close({})} className="job-panel__close-button">
        <Close />
      </button>
    </div>
  )
}

JobsPanelTitle.propTypes = {
  close: PropTypes.func.isRequired,
  func: PropTypes.shape({}).isRequired,
  handleInitialJobInfo: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  openScheduleJob: PropTypes.bool.isRequired,
  setOpenScheduleJob: PropTypes.func.isRequired
}

export default JobsPanelTitle
