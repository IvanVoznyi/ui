import React from 'react'
import PropTypes from 'prop-types'

import JobsPanelTitleEdit from '../../elements/JobsPanelTitleEdit/JobsPanelTitleEdit'

import { ReactComponent as BackArrow } from '../../images/back-arrow.svg'
import { ReactComponent as Close } from '../../images/close.svg'
import { ReactComponent as Edit } from '../../images/edit.svg'

const JobsPanelTitleView = ({
  closePanel,
  func,
  functionMethod,
  functionName,
  functionVersion,
  handleEditJobTitle,
  isEdit,
  match,
  methodOptions,
  openScheduleJob,
  setFunctionMethod,
  setFunctionName,
  setFunctionVersion,
  setIsEdit,
  setOpenScheduleJob,
  versionOptions
}) => {
  return (
    <div className="job-panel__title">
      <div
        className={`job-panel__title-wrapper ${isEdit &&
          'job-panel__title-wrapper_edit'}`}
      >
        {openScheduleJob && (
          <div className="job-schedule-container">
            <BackArrow onClick={() => setOpenScheduleJob(false)} />
            <span className="job-schedule__title">Schedule Job</span>
          </div>
        )}
        {!isEdit ? (
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
                <>
                  <span className="job-panel__version">
                    Version: {functionVersion === 'latest' && '$'}
                    {functionVersion}
                  </span>
                  {functionMethod && (
                    <span className="job-panel__method">
                      Method: {functionMethod}
                    </span>
                  )}
                </>
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
        ) : (
          <JobsPanelTitleEdit
            functionMethod={functionMethod}
            functionName={functionName}
            functionVersion={functionVersion}
            handleEditJobTitle={handleEditJobTitle}
            match={match}
            methodOptions={methodOptions}
            setFunctionMethod={setFunctionMethod}
            setFunctionName={setFunctionName}
            setFunctionVersion={setFunctionVersion}
            versionOptions={versionOptions}
          />
        )}
      </div>
      <button
        onClick={() => closePanel({})}
        className="job-panel__close-button"
      >
        <Close />
      </button>
    </div>
  )
}

JobsPanelTitleView.propTypes = {
  closePanel: PropTypes.func.isRequired,
  func: PropTypes.shape({}).isRequired,
  functionMethod: PropTypes.string.isRequired,
  functionName: PropTypes.string.isRequired,
  functionVersion: PropTypes.string.isRequired,
  handleEditJobTitle: PropTypes.func.isRequired,
  isEdit: PropTypes.bool.isRequired,
  match: PropTypes.shape({}).isRequired,
  methodOptions: PropTypes.array.isRequired,
  openScheduleJob: PropTypes.bool.isRequired,
  setFunctionMethod: PropTypes.func.isRequired,
  setFunctionName: PropTypes.func.isRequired,
  setFunctionVersion: PropTypes.func.isRequired,
  setIsEdit: PropTypes.func.isRequired,
  setOpenScheduleJob: PropTypes.func.isRequired,
  versionOptions: PropTypes.array.isRequired
}

export default JobsPanelTitleView
