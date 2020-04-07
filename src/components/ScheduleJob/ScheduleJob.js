import React, { useState } from 'react'
import PropTypes from 'prop-types'

import ScheduleJobNormal from '../ScheduleJobNormal/ScheduleJobNormal'

import { ReactComponent as Schedule } from '../../images/schedule.svg'

import scheduleData from './scheduleData.json'

import './scheduleJob.scss'

const ScheduleJob = ({ match }) => {
  const [normal] = scheduleData.tabs
  const [activeTab, setActiveTab] = useState(normal.id)

  return (
    <div className="schedule_container">
      <div className="schedule_tabs">
        {scheduleData.tabs.map(tab => (
          <div
            key={tab.id}
            className={`schedule_tabs_item ${activeTab === tab.id && 'active'}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.title}
          </div>
        ))}
      </div>
      {activeTab === normal.id && <ScheduleJobNormal match={match} />}
      <button>
        <Schedule />
        Schedule
      </button>
    </div>
  )
}

ScheduleJob.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default ScheduleJob
