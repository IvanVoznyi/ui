import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as Arrow } from '../../images/dropdown.svg'

import './input.scss'

const Input = ({
  type,
  className,
  inputIcon,
  onChange,
  iconCLass,
  disabled,
  label,
  floatingLabel,
  value,
  placeholder,
  onKeyDown
}) => {
  const [labelToTop, setLabelToTop] = useState(false)
  const handleClick = e => {
    if (e.target.value.length > 0) {
      setLabelToTop(true)
    } else {
      setLabelToTop(false)
    }
    onChange(e.target.value)
  }

  const handleIncrease = () => {
    onChange(++value)
  }

  const handleDecrease = () => {
    onChange(--value)
  }

  return (
    <div className="input-wrapper">
      <input
        type={type}
        onInput={e => onChange(e.target.value)}
        className={`input ${className}`}
        onChange={e => handleClick(e)}
        disabled={disabled}
        value={value}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
      />
      {type !== 'number' && (
        <label
          className={`input__label ${labelToTop &&
            floatingLabel &&
            'active'} ${floatingLabel && 'input__label-floating'}`}
        >
          {label}:
        </label>
      )}
      {type === 'number' && (
        <div className="arrow_container">
          <Arrow className="arrow_up" onClick={() => handleIncrease()} />
          <Arrow className="arrow_down" onClick={() => handleDecrease()} />
        </div>
      )}
      {inputIcon && <span className={iconCLass}>{inputIcon}</span>}
    </div>
  )
}

Input.defaultProps = {
  inputIcon: null,
  iconCLass: null,
  onChange: null,
  disabled: false
}

Input.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  inputIcon: PropTypes.element,
  iconCLass: PropTypes.string,
  onChange: PropTypes.func,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
}

export default Input
