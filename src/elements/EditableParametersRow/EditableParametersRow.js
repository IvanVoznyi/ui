import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'

import { ReactComponent as Checkmark } from '../../images/checkmark.svg'

const EditableParametersRow = ({
  handleEdit,
  match,
  selectOption,
  selectedParameter,
  setSelectedParameter
}) => {
  return (
    <div className="table__row edit-row">
      <div className="table__cell parameter-name">
        {selectedParameter.items.name}
      </div>
      <div className="table__cell">{selectedParameter.items.type}</div>
      <div className="table__cell table__cell_edit">
        <Input
          onChange={value => {
            setSelectedParameter({
              ...selectedParameter,
              items: {
                ...selectedParameter.items,
                value: value
              }
            })
          }}
          type="text"
          value={selectedParameter.items.value}
        />
      </div>
      <div className="table__cell table__cell_edit">
        <Select
          label={selectedParameter.items.simple}
          match={match}
          onClick={simple =>
            setSelectedParameter({
              ...selectedParameter.items,
              items: {
                ...selectedParameter.items,
                simple: simple
              }
            })
          }
          options={selectOption.parameterType}
        />
      </div>
      <div className="table__cell table__cell-edit">
        <button
          className="apply-edit-btn"
          onClick={() => handleEdit(selectedParameter, false)}
        >
          <Checkmark />
        </button>
      </div>
    </div>
  )
}

EditableParametersRow.propTypes = {
  handleEdit: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  selectOption: PropTypes.shape({}).isRequired,
  selectedParameter: PropTypes.shape({}).isRequired,
  setSelectedParameter: PropTypes.func.isRequired
}

export default EditableParametersRow
