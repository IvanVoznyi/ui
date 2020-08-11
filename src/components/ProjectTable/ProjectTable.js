import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

import TableTypeCell from '../../elements/TableTypeCell/TableTypeCell'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

import './projectTable.scss'

const ProjectTable = ({ table }) => {
  return (
    <>
      <div className="project-data-card__table">
        <div className="project-data-card__table-header">
          {table.header.map(header => (
            <div
              key={header.value}
              className={`project-data-card__table-header__item ${header.className}`}
            >
              <Tooltip template={<TextTooltipTemplate text={header.value} />}>
                {header.value}
              </Tooltip>
            </div>
          ))}
        </div>
        <div className="project-data-card__table-body">
          {table.body.map((body, index) => {
            return (
              <div key={index} className="project-data-card__table-body__row">
                {Object.keys(body).map((key, index) => {
                  const tableValueClassName = classnames(
                    'project-data-card__table-body__row-value',
                    body[key].className,
                    key === 'status' && `status_${body[key].value} capitalize`
                  )

                  return key === 'type' ? (
                    <TableTypeCell
                      key={body[key].value + index}
                      data={body[key]}
                    />
                  ) : (
                    <div
                      key={body[key].value + index}
                      className={tableValueClassName}
                    >
                      {key === 'name' ? (
                        <Link
                          className="project-data-card__table-body__row-value__link"
                          to={body[key].link}
                        >
                          <Tooltip
                            template={
                              <TextTooltipTemplate text={body[key].value} />
                            }
                          >
                            {body[key].value}
                          </Tooltip>
                        </Link>
                      ) : (
                        <Tooltip
                          template={
                            <TextTooltipTemplate text={body[key].value} />
                          }
                        >
                          {body[key].value}
                        </Tooltip>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

ProjectTable.propTypes = {
  table: PropTypes.shape({}).isRequired
}

export default React.memo(ProjectTable)
