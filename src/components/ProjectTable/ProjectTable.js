import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

import TableTypeCell from '../../elements/TableTypeCell/TableTypeCell'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

import './projectTable.scss'

const ProjectTable = ({ seeAllLink, table }) => {
  return (
    <>
      <div className="project__main-info__table">
        <div className="project__main-info__table-header">
          {table.header.map(header => (
            <div
              key={header.value}
              className={`project__main-info__table-header__item ${header.className}`}
            >
              <Tooltip template={<TextTooltipTemplate text={header.value} />}>
                {header.value}
              </Tooltip>
            </div>
          ))}
        </div>
        <div className="project__main-info__table-body">
          {table.body.map((body, index) => {
            return (
              <div key={index} className="project__main-info__table-body__row">
                {Object.keys(body).map((key, index) => {
                  const tableValueClassName = classnames(
                    'project__main-info__table-body__row-value',
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
                          className="project__main-info__table-body__row-value__link"
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
      <Link className="project__main-info__jobs__link-all" to={seeAllLink}>
        See all
      </Link>
    </>
  )
}

ProjectTable.propTypes = {
  table: PropTypes.shape({}).isRequired,
  seeAllLink: PropTypes.string.isRequired
}

export default React.memo(ProjectTable)
