import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import './projectStatistics.scss'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

const ProjectStatistics = ({ statistics }) => {
  return Object.keys(statistics).map((key, index) => {
    return (
      <div key={key + index} className="project__main-info__statistics-item">
        <Link
          className="project__main-info__statistics-item__link"
          to={statistics[key].link}
        >
          <div
            className={`project__main-info__statistics-item__value statistics_${statistics[key].className}`}
          >
            {statistics[key].value}
          </div>
          <div className="project__main-info__statistics-item__label">
            <Tooltip
              template={<TextTooltipTemplate text={statistics[key].label} />}
            >
              {statistics[key].label}
            </Tooltip>
          </div>
        </Link>
      </div>
    )
  })
}

ProjectStatistics.propTypes = {
  statistics: PropTypes.shape({}).isRequired
}

export default React.memo(ProjectStatistics)
