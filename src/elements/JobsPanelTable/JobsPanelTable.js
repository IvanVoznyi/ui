import React, { useState } from 'react'
import PropTypes from 'prop-types'

import EditableDataInputsRow from '../EditableDataInputsRow/EditableDataInputsRow'
import JobsPanelTableRow from '../JobsPanelTableRow/JobsPanelTableRow'
import EditableParametersRow from '../EditableParametersRow/EditableParametersRow'
import EditableVolumesRow from '../EditableVolumesRow/EditableVolumesRow'

import { ReactComponent as Edit } from '../../images/edit.svg'
import { ReactComponent as Delete } from '../../images/delete.svg'

import './jobsPanelTable.scss'

const JobsPanelTable = ({
  addNewItem,
  children,
  className,
  content,
  headers,
  handleDeleteItems,
  handleEditItems,
  handleEditParameter,
  match,
  section,
  selectedItem,
  setSelectedDataInput,
  setSelectedParameter,
  setSelectedVolume,
  volumes
}) => {
  const [editItem, setEditItem] = useState(false)

  const selectOption = {
    parameterType: [
      { label: 'Simple', id: 'Simple' },
      { label: 'Hyper', id: 'Hyper' }
    ]
  }

  const generateActionsMenu = item => {
    const isVisible =
      (!item.data.isValueEmpty || !item.data.path) && item.isDefault
    return [
      {
        label: 'Edit',
        icon: <Edit />,
        visible: isVisible,
        onClick: param => handleEdit(param)
      },
      {
        label: 'Remove',
        icon: <Delete />,
        visible: isVisible,
        onClick: item => {
          handleDelete(item)
        }
      }
    ]
  }

  const handleEdit = (item, isInput) => {
    if (editItem) {
      setEditItem(false)
      section === 'parameters'
        ? handleEditParameter()
        : handleEditItems(isInput)
    } else {
      switch (section) {
        case 'parameters':
          setSelectedParameter(item)
          break
        case 'data-inputs':
          setSelectedDataInput(item)
          break
        default:
          handleSetSelectedVolume(item)
      }
      setEditItem(true)
    }
  }

  const handleSetSelectedVolume = selectedVolume => {
    const searchItem = volumes.find(
      volume => volume.name === selectedVolume.data.name
    )

    let newValue

    if (searchItem.configMap) {
      newValue = {
        value: 'Config Map',
        name: searchItem.configMap.name
      }
    } else if (searchItem.persistentVolumeClaim) {
      newValue = {
        value: 'PVC',
        name: searchItem.persistentVolumeClaim.claimName
      }
    } else if (searchItem.secret) {
      newValue = {
        value: 'Secret',
        name: searchItem.secret.secretName
      }
    } else {
      newValue = {
        value: 'V3IO',
        name: searchItem.flexVolume.options.container,
        accessKey: searchItem.flexVolume.options.accessKey,
        subPath: searchItem.flexVolume.options.subPath
      }
    }

    setSelectedVolume({
      ...selectedVolume,
      type: newValue
    })
  }

  const handleDelete = item => {
    handleDeleteItems(section === 'data-inputs', item)
  }

  return (
    <div
      className={`job-panel__table ${addNewItem && 'no-border'} ${className}`}
    >
      {headers.length > 0 && (
        <div className="table__header table__row no-hover">
          {headers.map((header, index) => (
            <div className="table__cell" key={index}>
              {header.label}
            </div>
          ))}
          <div className="table__cell offset" />
        </div>
      )}
      {content.map((contentItem, index) => {
        if (editItem && contentItem.data.name === selectedItem.data.name) {
          return section === 'parameters' ? (
            <EditableParametersRow
              handleEdit={handleEdit}
              key={index}
              match={match}
              selectOption={selectOption}
              selectedParameter={selectedItem}
              setSelectedParameter={setSelectedParameter}
            />
          ) : section === 'data-inputs' ? (
            <EditableDataInputsRow
              handleEdit={handleEdit}
              key={index}
              selectedDataInput={selectedItem}
              setSelectedDataInput={setSelectedDataInput}
            />
          ) : (
            <EditableVolumesRow
              handleEdit={handleEdit}
              key={index}
              selectedVolume={selectedItem}
              setSelectedVolume={setSelectedVolume}
            />
          )
        } else {
          return (
            <JobsPanelTableRow
              actionsMenu={generateActionsMenu(contentItem)}
              item={contentItem}
              key={index}
            />
          )
        }
      })}
      {children}
    </div>
  )
}

JobsPanelTable.defaultProps = {
  className: '',
  headers: [],
  handleEditItems: null,
  handleEditParameter: null,
  etSelectedDataInput: null,
  setSelectedParameter: null,
  setSelectedVolume: null
}

JobsPanelTable.propTypes = {
  addNewItem: PropTypes.bool.isRequired,
  className: PropTypes.string,
  content: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.shape({})
  ]).isRequired,
  headers: PropTypes.arrayOf(PropTypes.shape({})),
  handleEditItems: PropTypes.func,
  handleEditParameter: PropTypes.func,
  match: PropTypes.shape({}).isRequired,
  section: PropTypes.string.isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  setSelectedDataInput: PropTypes.func,
  setSelectedParameter: PropTypes.func,
  setSelectedVolume: PropTypes.func,
  volumes: PropTypes.arrayOf(PropTypes.shape({}))
}

export default JobsPanelTable
