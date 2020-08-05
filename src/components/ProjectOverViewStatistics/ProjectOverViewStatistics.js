import React from 'react'
import { Link } from 'react-router-dom'

import './projectOverViewStatistics.scss'

const ProjectOverViewStatistics = ({ statistics }) => {
  return Object.keys(statistics).map((key, index) => {
    return (
      <div
        key={key + index}
        className="project-container__main-panel__statistics-item"
      >
        <Link to={statistics[key].link}>
          <div
            className={`project-container__main-panel__statistics-item__value statistics_${statistics[key].className}`}
          >
            {statistics[key].value}
          </div>
          <div className="project-container__main-panel__statistics-item__label">
            {statistics[key].label}
          </div>
        </Link>
      </div>
    )
  })
}

export default ProjectOverViewStatistics
