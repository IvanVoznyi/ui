import React, { useState } from 'react'

import ScheduleJobNormal from '../ScheduleJobNormal/ScheduleJobNormal'
import { ReactComponent as Schedule } from '../../images/schedule.svg'

import scheduleData from './scheduleData.json'

import './scheduleJob.scss'

const ScheduleJob = () => {
  const [activeTab, setActiveTab] = useState('normal')

  return (
    <div className="schedule_container">
      <div className="schedule_tabs">
        {scheduleData.tabs.map(tab => (
          <div
            key={tab}
            className={`schedule_tabs_item ${activeTab.toLowerCase() ===
              tab.toLowerCase() && 'active'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>
      {activeTab.toLowerCase() === 'normal' && <ScheduleJobNormal />}
      <button>
        <Schedule />
        Schedule
      </button>
    </div>
  )
}

export default ScheduleJob
