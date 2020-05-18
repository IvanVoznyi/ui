import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'

const JobsPanelTitleEdit = ({
  functionMethod,
  functionName,
  functionVersion,
  handleEditJobTitle,
  match,
  methodOptions,
  setFunctionMethod,
  setFunctionName,
  setFunctionVersion,
  versionOptions
}) => {
  return (
    <>
      <Input onChange={setFunctionName} type="text" value={functionName} />
      <div className="job-panel__select-container">
        <Select
          className={methodOptions.length !== 0 ? 'select_left' : ''}
          label="Version"
          floatingLabel
          match={match}
          onClick={setFunctionVersion}
          options={versionOptions}
          selectedId={functionVersion}
        />
        {methodOptions.length !== 0 && (
          <Select
            label="Method"
            match={match}
            floatingLabel
            onClick={setFunctionMethod}
            options={methodOptions}
            selectedId={functionMethod}
          />
        )}
      </div>
      <button className="btn btn_primary" onClick={handleEditJobTitle}>
        Done
      </button>
    </>
  )
}

JobsPanelTitleEdit.propTypes = {
  functionMethod: PropTypes.string.isRequired,
  functionName: PropTypes.string.isRequired,
  functionVersion: PropTypes.string.isRequired,
  handleEditJobTitle: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  methodOptions: PropTypes.array.isRequired,
  setFunctionMethod: PropTypes.func.isRequired,
  setFunctionName: PropTypes.func.isRequired,
  setFunctionVersion: PropTypes.func.isRequired,
  versionOptions: PropTypes.array.isRequired
}

export default JobsPanelTitleEdit
