import React, { useState } from 'react'

import Input from '../../common/Input/Input'

import { ReactComponent as UnCheckBox } from '../../images/checkbox-unchecked.svg'
import { ReactComponent as CheckBox } from '../../images/checkbox-checked.svg'

import './scheduleJobNormal.scss'

const ScheduleJobNormal = () => {
  const [check, setCheck] = useState(false)
  return (
    <div className="schedule-job-normal_container">
      <div className="input_container">
        <Input
          label="Date"
          type="text"
          className="input-row__item"
          floatingLabel
        />
        <Input
          label="Time"
          type="text"
          className="input-row__item"
          floatingLabel
        />
      </div>
      <div className="checkbox_container">
        <span onClick={() => setCheck(!check)}>
          {check ? (
            <CheckBox className={check && 'checked'} />
          ) : (
            <UnCheckBox className="unchecked" />
          )}
          Recurring
        </span>
      </div>
      <div className="recurring_container">
        <span></span>
      </div>
    </div>
  )
}

export default ScheduleJobNormal
