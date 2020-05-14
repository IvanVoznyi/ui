import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'

import SelectOption from '../../elements/SelectOption/SelectOption'

import options from './selectData'

import { ReactComponent as Caret } from '../../images/dropdown.svg'

import './select.scss'

const Select = ({
  className,
  disabled,
  floatingLabel,
  label,
  match,
  onClick,
  option,
  page,
  value
}) => {
  const [isOpen, setOpen] = useState(false)
  const history = useHistory()

  const selectValue = Array.isArray(option)
    ? option.find(item => item.id === value)
    : options[option].find(item => item.id === value)

  const selectOption = Array.isArray(option) ? option : options[option]

  useEffect(() => {
    window.addEventListener('scroll', handlerScroll)
    return () => {
      window.removeEventListener('scroll', handlerScroll)
    }
  }, [isOpen])

  const handlerScroll = () => {
    setOpen(false)
  }

  const toggleOpen = disabled => (disabled ? null : setOpen(!isOpen))

  const handleSelectOption = item => {
    if (match.params.jobId || match.params.name) {
      history.push(
        `/projects/${match.params.projectName}/${page.toLowerCase()}`
      )
    }

    onClick(item)
  }

  return (
    <div
      className={`select ${className}${isOpen ? ' active' : ''}`}
      onClick={() => toggleOpen(disabled)}
    >
      <div className="select__header">
        {label && (
          <div
            className={`select__label ${value &&
              floatingLabel &&
              'select__label_floating'}`}
          >
            {label}
          </div>
        )}
        <div
          className={`select__value ${value &&
            floatingLabel &&
            'select__value_floating'}`}
        >
          {value && selectValue?.label}
          {selectValue?.subLabel && (
            <span className="sub-label">{selectValue.subLabel}</span>
          )}
        </div>
        <Caret className="select__caret" />
      </div>
      {selectOption.length > 0 &&
        isOpen && [
          <div className="overall" key={isOpen} />,
          <div
            className="select__body"
            onClick={() => {
              setOpen(false)
            }}
            key={!isOpen}
          >
            {selectOption.map(item => (
              <SelectOption
                key={item.id}
                item={item}
                selectedId={value}
                status={option === 'status'}
                onClick={handleSelectOption}
              />
            ))}
          </div>
        ]}
    </div>
  )
}

Select.defaultProps = {
  className: '',
  disabled: false,
  onClick: null,
  label: '',
  page: ''
}

Select.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  floatingLabel: PropTypes.bool,
  label: PropTypes.string,
  match: PropTypes.shape({}).isRequired,
  onClick: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  option: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  page: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
}

export default React.memo(Select)
