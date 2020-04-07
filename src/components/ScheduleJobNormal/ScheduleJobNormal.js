import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'

import { ReactComponent as UnCheckBox } from '../../images/checkbox-unchecked.svg'
import { ReactComponent as CheckBox } from '../../images/checkbox-checked.svg'

import './scheduleJobNormal.scss'

const ScheduleJobNormal = ({ match }) => {
  const [isRecurring, setIsRecurring] = useState(false)
  const [stepRepeat, setStepRepeat] = useState(1)
  const [repeatOptions, setRepeatOptions] = useState('Minute')
  const [repeatEndOptions, setRepeatEndOptions] = useState('Never')
  const [date, setDate] = useState()
  const [time, setTime] = useState()

  return (
    <div className="schedule-job-normal_container">
      <h3>Normal Schedule</h3>
      <div className="input_container">
        <Input
          value={date}
          onChange={setDate}
          label="Date"
          type="text"
          className="input-row__item"
          floatingLabel
        />
        <Input
          value={time}
          onChange={setTime}
          label="Time"
          type="text"
          className="input-row__item"
          floatingLabel
        />
      </div>
      <div className="checkbox_container">
        <span onClick={() => setIsRecurring(!isRecurring)}>
          {isRecurring ? (
            <CheckBox className={isRecurring && 'checked'} />
          ) : (
            <UnCheckBox className="unchecked" />
          )}
          Recurring
        </span>
      </div>
      {isRecurring && (
        <div className="recurring_container">
          <span>Repeat every</span>
          <div className="repeat_container">
            <Input
              value={stepRepeat}
              type="number"
              onChange={setStepRepeat}
              label=""
            />
            <Select
              match={match}
              page="jobs"
              option={'repeat step'}
              value={repeatOptions}
              onClick={setRepeatOptions}
            />
          </div>
          <span>Ends</span>
          <div className="repeat_end_container">
            <Select
              match={match}
              page="jobs"
              option={'repeat end'}
              value={repeatEndOptions}
              onClick={setRepeatEndOptions}
            />
          </div>
        </div>
      )}
    </div>
  )
}

ScheduleJobNormal.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default ScheduleJobNormal
