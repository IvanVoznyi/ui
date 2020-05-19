import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'

const JobsPanelTitleEdit = ({
  currentFunction,
  handleCurrentFunction,
  handleEditJobTitle,
  match,
  methodOptions,
  versionOptions
}) => {
  return (
    <>
      <Input
        onChange={name => handleCurrentFunction({ name })}
        type="text"
        value={currentFunction.name}
      />
      <div className="job-panel__select-container">
        <Select
          className={methodOptions.length !== 0 ? 'select_left' : ''}
          floatingLabel
          label="Version"
          match={match}
          onClick={version => handleCurrentFunction({ version })}
          options={versionOptions}
          selectedId={currentFunction.version}
        />
        {methodOptions.length !== 0 && (
          <Select
            floatingLabel
            label="Method"
            match={match}
            onClick={method => handleCurrentFunction({ method })}
            options={methodOptions}
            selectedId={currentFunction.method}
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
  currentFunction: PropTypes.shape({}).isRequired,
  handleCurrentFunction: PropTypes.func.isRequired,
  handleEditJobTitle: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  methodOptions: PropTypes.array.isRequired,
  versionOptions: PropTypes.array.isRequired
}

export default JobsPanelTitleEdit
