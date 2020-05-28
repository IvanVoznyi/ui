import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'

import { ReactComponent as Checkmark } from '../../images/checkmark.svg'

const EditableDataInputsRow = ({
  handleEdit,
  selectedDataInput,
  setSelectedDataInput
}) => {
  return (
    <div className="table__row edit-row">
      <div className="table__cell parameter-name">
        {selectedDataInput.items.name}
      </div>
      <div className="table__cell table__cell_edit">
        <Input
          onChange={path =>
            setSelectedDataInput({
              ...selectedDataInput,
              items: { ...selectedDataInput.items, path: path }
            })
          }
          type="text"
          value={selectedDataInput.items.path}
        />
      </div>
      <div className="table__cell actions_cell">
        <button
          className="apply-edit-btn"
          onClick={() => handleEdit(selectedDataInput.items, true)}
        >
          <Checkmark />
        </button>
      </div>
    </div>
  )
}

EditableDataInputsRow.propTypes = {
  handleEdit: PropTypes.func.isRequired,
  selectedDataInput: PropTypes.shape({}).isRequired,
  setSelectedDataInput: PropTypes.func.isRequired
}

export default EditableDataInputsRow
