import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as Add } from '../../images/add.svg'
import { ReactComponent as Close } from '../../images/close.svg'

import JobsPanelFormLabel from '../JobPanelFormLabel/JobPanelFormLabel'
import { panelActions } from '../JobsPanel/panelReducer'

import './jobPanelLabels.scss'

const JobsPanelLabels = ({ editTitle, labels, panelDispatch }) => {
  const [editConfig, setEditConfig] = useState({
    labelIndex: null,
    isEdit: false,
    isAddNewLabel: false,
    isKeyFocused: true,
    isValueFocused: false
  })

  const removeLabel = useCallback(
    key => {
      const newLabels = labels.filter(label => {
        return label.key !== key
      })
      panelDispatch({ type: panelActions.REMOVE_JOB_LABEL, payload: newLabels })
    },
    [labels, panelDispatch]
  )

  const addLabel = useCallback(
    ({ label, isAdd }) => {
      if (isAdd && label.key && label.value) {
        panelDispatch({
          type: panelActions.SET_JOB_LABEL,
          payload: [...labels, label]
        })
      }
      setEditConfig({
        labelIndex: null,
        isEdit: false,
        isKeyFocused: true,
        isValueFocused: false,
        isAddNewLabel: false
      })
    },
    [panelDispatch, labels]
  )

  const editlabel = useCallback(
    (label, isClick) => {
      if (label.key && label.value) {
        const newLabels = [...labels]
        newLabels[editConfig.labelIndex] = label

        panelDispatch({
          type: panelActions.EDIT_JOB_LABEL,
          payload: newLabels
        })
      }

      if (editConfig.labelIndex === labels.length - 1) {
        setEditConfig(prevState => ({
          ...prevState,
          labelIndex: null,
          isEdit: false,
          isKeyFocused: true,
          isValueFocused: false
        }))
      } else {
        setEditConfig(prevState => ({
          ...prevState,
          labelIndex: !isClick ? prevState.labelIndex + 1 : null,
          isKeyFocused: !isClick ? prevState.isKeyFocused : true,
          isValueFocused: !isClick ? prevState.isValueFocused : false
        }))
      }
    },
    [editConfig, labels, panelDispatch]
  )

  const handleIsEdit = useCallback(
    (event, index) => {
      event.stopPropagation()

      if (editConfig.isAddNewLabel) {
        return setEditConfig(prevState => ({
          ...prevState,
          isKeyFocused: true,
          isAddNewLabel: false
        }))
      }

      setEditConfig({
        labelIndex: index,
        isEdit: true,
        isKeyFocused: true,
        isValueFocused: false,
        isAddNewLabel: false
      })
    },
    [editConfig.isAddNewLabel]
  )

  return (
    <div className="job-labels-container">
      <div className="job-labels__text">Labels</div>
      <div className="job-labels-wrapper">
        {labels.map((label, index) => {
          return !(editConfig.labelIndex === index) ? (
            <div className="job-labels__item" key={label.key}>
              <div
                className="job-labels__item-key data-ellipsis"
                onClick={event => handleIsEdit(event, index)}
              >
                {label.key}
              </div>
              <div className="job-labels__item-separator">:</div>
              <div
                className="job-labels__item-key data-ellipsis"
                onClick={event => handleIsEdit(event, index)}
              >
                {label.value}
              </div>
              <button
                className="job-labels__item-icon-close"
                onClick={() => removeLabel(label.key)}
              >
                <Close />
              </button>
            </div>
          ) : (
            <JobsPanelFormLabel
              editConfig={editConfig}
              key={label.key}
              label={label}
              onChange={editlabel}
              setEditConfig={setEditConfig}
            />
          )
        })}
        {editConfig.isAddNewLabel ? (
          <JobsPanelFormLabel
            editConfig={editConfig}
            onChange={addLabel}
            setEditConfig={setEditConfig}
          />
        ) : (
          editTitle && (
            <button
              className="job-labels__button-add"
              onClick={event => {
                event.stopPropagation()
                setEditConfig(prevState => ({
                  ...prevState,
                  isAddNewLabel: true
                }))
              }}
            >
              <Add />
            </button>
          )
        )}
      </div>
    </div>
  )
}

JobsPanelLabels.propTypes = {
  editTitle: PropTypes.bool.isRequired,
  labels: PropTypes.array.isRequired,
  panelDispatch: PropTypes.func.isRequired
}

export default JobsPanelLabels
