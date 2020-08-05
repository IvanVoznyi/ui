import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

import TableTypeCell from '../../elements/TableTypeCell/TableTypeCell'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

import './projectOverViewTable.scss'

const ProjectOverViewTable = ({ table, linktoAllItem }) => {
  return (
    <>
      <div className="project-container__main-panel__table">
        <div className="project-container__main-panel__table-header">
          {table.header.map(header => (
            <div
              key={header.value}
              className={`project-container__main-panel__table-header__item ${header.className}`}
            >
              <Tooltip template={<TextTooltipTemplate text={header.value} />}>
                {header.value}
              </Tooltip>
            </div>
          ))}
        </div>
        <div className="project-container__main-panel__table-body">
          {table.body.map((body, index) => {
            return (
              <div
                key={index}
                className="project-container__main-panel__table-body__row"
              >
                {Object.keys(body).map((key, index) => {
                  const tableValueClassName = classnames(
                    'project-container__main-panel__table-body__row-value',
                    body[key].className,
                    key === 'status' && `status_${body[key].value}`
                  )

                  return key === 'name' ? (
                    <div
                      key={body[key].value + index}
                      className={tableValueClassName}
                    >
                      <Link
                        className="project-container__main-panel__table-body__row-value__link"
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
                    </div>
                  ) : key === 'type' ? (
                    <TableTypeCell
                      key={body[key].value + index}
                      data={body[key]}
                    />
                  ) : (
                    <div
                      key={body[key].value + index}
                      className={tableValueClassName}
                    >
                      <Tooltip
                        template={
                          <TextTooltipTemplate text={body[key].value} />
                        }
                      >
                        {body[key].value}
                      </Tooltip>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
      <Link
        className="project-container__main-panel__jobs__link-all"
        to={linktoAllItem}
      >
        See all
      </Link>
    </>
  )
}

export default ProjectOverViewTable
