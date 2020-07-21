import React, { useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './chipForm.scss'

const ChipForm = ({
  className,
  editConfig,
  value,
  onChange,
  setEditConfig
}) => {
  const [chip, setChip] = useState(value)

  const refInputKey = React.createRef()
  const refInputValue = React.createRef()

  const labelKeyClassName = classnames(
    className,
    !editConfig.isKeyFocused && 'job-labels__item_edited'
  )
  const labelContainerClassName = classnames(
    'edit-label-container',
    (editConfig.isEdit || editConfig.isAddNewLabel) &&
      'edit-label-container_edited'
  )
  const labelValueClassName = classnames(
    classnames(
      'input-label-value',
      !editConfig.isValueFocused && 'job-labels__item_edited'
    )
  )

  useEffect(() => {
    if (editConfig.isKeyFocused) {
      refInputKey.current.focus()
    } else if (editConfig.isValueFocused) {
      refInputValue.current.focus()
    }
  }, [
    editConfig.isKeyFocused,
    editConfig.isValueFocused,
    refInputKey,
    refInputValue
  ])

  const outsideClick = useCallback(
    event => {
      event.stopPropagation()
      if (!editConfig.isKeyFocused && !editConfig.isValueFocused) {
        onChange(chip, true)
      }
    },
    [chip, onChange, editConfig.isKeyFocused, editConfig.isValueFocused]
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
        if (
          !event.shiftKey &&
          event.key === 'Tab' &&
          editConfig.isValueFocused
        ) {
          onChange(chip)
        } else if (
          event.shiftKey &&
          event.key === 'Tab' &&
          editConfig.isKeyFocused
        ) {
          onChange(chip)
        }
      }
    },
    [editConfig, onChange, chip]
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

  const handleOnChangeKey = useCallback(
    event => {
      event.preventDefault()
      setChip(prevState => ({
        ...prevState,
        key: refInputKey.current.value
      }))
    },
    [refInputKey]
  )

  const handleOnChangeValue = useCallback(
    event => {
      event.preventDefault()
      setChip(prevState => ({
        ...prevState,
        value: refInputValue.current.value
      }))
    },
    [refInputValue]
  )

  return (
    <div
      className={labelContainerClassName}
      onKeyDown={event => editConfig.isEdit && focusNextlabel(event)}
    >
      <input
        autoComplete="off"
        className={labelKeyClassName}
        name="key"
        onBlur={handleOnBlurKey}
        onChange={handleOnChangeKey}
        onFocus={handleOnFocusKey}
        placeholder="key"
        ref={refInputKey}
        style={{ width: chip.key.length * 10 }}
        type="text"
        value={chip.key}
      />
      <div className="edit-label-separator">:</div>
      <input
        autoComplete="off"
        className={labelValueClassName}
        name="value"
        onBlur={handleOnBlurValue}
        onChange={handleOnChangeValue}
        onFocus={handleOnFocusValue}
        placeholder="value"
        ref={refInputValue}
        style={{ width: chip.value.length * 10 }}
        type="text"
        value={chip.value}
      />
    </div>
  )
}

ChipForm.defaultProps = {
  label: {
    key: '',
    value: ''
  }
}

ChipForm.propTypes = {
  editConfig: PropTypes.shape({}).isRequired,
  label: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired,
  setEditConfig: PropTypes.func.isRequired
}

export default ChipForm
