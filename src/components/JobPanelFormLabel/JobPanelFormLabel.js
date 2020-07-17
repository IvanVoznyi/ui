import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Input from '../../common/Input/Input'

import { ReactComponent as Add } from '../../images/add.svg'

import './jobPanelFormlabel.scss'

const JobsPanelFormLabel = ({ editConfig, label, onChange, setEditConfig }) => {
  const [_label, setLabel] = useState(label)

  const labelKeyClassName = classnames(
    !editConfig.isKeyFocused && 'job-labels__item_edited'
  )
  const labelContainerClassName = classnames(
    'edit-label-container',
    (editConfig.isEdit || editConfig.isAddNewLabel) &&
      'edit-label-container_edited'
  )
  const labelValueClassName = classnames(
    classnames(!editConfig.isValueFocused && 'job-labels__item_edited')
  )

  const outsideClick = useCallback(
    event => {
      event.stopPropagation()
      if (!editConfig.isKeyFocused && !editConfig.isValueFocused) {
        onChange(_label, true)
      }
    },
    [_label, onChange, editConfig.isKeyFocused, editConfig.isValueFocused]
  )

  useEffect(() => {
    if (editConfig.isEdit) {
      document.addEventListener('click', outsideClick, true)
      return () => {
        document.removeEventListener('click', outsideClick, true)
      }
    }
  }, [outsideClick, editConfig.isEdit])

  const focusNextlabel = useCallback(
    event => {
      event.stopPropagation()
      if (editConfig.isEdit) {
        if (!event.shiftKey && event.key === 'Tab' && editConfig.isKeyFocused) {
          onChange(_label)
        } else if (
          event.shiftKey &&
          event.key === 'Tab' &&
          editConfig.isValueFocused
        ) {
          onChange(_label)
        }
      }
    },
    [editConfig, onChange, _label]
  )

  const handleOnFocusKey = useCallback(() => {
    setEditConfig(prevState => ({
      ...prevState,
      isKeyFocused: true
    }))
  }, [setEditConfig])

  const handleOnBlurKey = useCallback(() => {
    setEditConfig(prevState => ({
      ...prevState,
      isKeyFocused: false
    }))
  }, [setEditConfig])

  const handleOnChangeKey = useCallback(
    value => {
      setLabel(prevValue => ({
        ...prevValue,
        key: value
      }))
    },
    [setLabel]
  )

  const handleOnFocusValue = useCallback(() => {
    setEditConfig(prevState => ({
      ...prevState,
      isValueFocused: true
    }))
  }, [setEditConfig])

  const handleOnBlurValue = useCallback(() => {
    setEditConfig(prevState => ({
      ...prevState,
      isValueFocused: false
    }))
  }, [setEditConfig])

  const handleOnChangeValue = useCallback(
    value => {
      setLabel(prevValue => ({
        ...prevValue,
        value
      }))
    },
    [setLabel]
  )

  const handleAddNewLabel = useCallback(
    event => {
      event.stopPropagation()
      onChange({ label: _label, isAdd: true })
    },
    [onChange, _label]
  )

  return (
    <>
      <div
        className={labelContainerClassName}
        onKeyDown={event => editConfig.isEdit && focusNextlabel(event)}
      >
        <Input
          type="text"
          className={labelKeyClassName}
          value={_label.key}
          focused={editConfig.isKeyFocused}
          onFocus={handleOnFocusKey}
          onBlur={handleOnBlurKey}
          placeholder="key"
          onChange={handleOnChangeKey}
        />
        <div className="edit-label-separator">:</div>
        <Input
          type="text"
          className={labelValueClassName}
          value={_label.value}
          placeholder="value"
          focused={editConfig.isValueFocused}
          onFocus={handleOnFocusValue}
          onBlur={handleOnBlurValue}
          onChange={handleOnChangeValue}
        />
      </div>
      {editConfig.isAddNewLabel && (
        <button className="job-labels__button-add" onClick={handleAddNewLabel}>
          <Add />
        </button>
      )}
    </>
  )
}

JobsPanelFormLabel.defaultProps = {
  label: {
    key: '',
    value: ''
  }
}

JobsPanelFormLabel.propTypes = {
  editConfig: PropTypes.shape({}).isRequired,
  label: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired,
  setEditConfig: PropTypes.func.isRequired
}

export default JobsPanelFormLabel
