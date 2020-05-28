import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import TableActionsMenu from '../../common/TableActionsMenu/TableActionsMenu'

import { has } from 'lodash'

import { joinDataOfArrayOrObject } from '../../utils'

import './jobsPanelTableRow.scss'

const JobsPanelTableRow = ({ actionsMenu, item, row }) => {
  return (
    <div className="table__row">
      {Object.keys(row).map((property, i) => {
        return (
          <div
            className={`table__cell ${
              ((property === 'name' && has(item.items, 'value')) ||
                property === 'type') &&
              item.isDefault
                ? `parameter-${property} table__cell_disable`
                : `parameter-${property}`
            }`}
            key={i}
          >
            <Tooltip
              className="table__cell-value"
              textShow={property === 'name' && item.doc ? true : false}
              template={
                <TextTooltipTemplate
                  text={
                    property === 'name'
                      ? item.doc
                      : joinDataOfArrayOrObject(row[property], ', ')
                  }
                />
              }
            >
              {joinDataOfArrayOrObject(row[property], ', ')}
            </Tooltip>
          </div>
        )
      })}
      <div className="table__cell actions_cell">
        {((!item.isValueEmpty && !item.isDefault) ||
          (item.isValueEmpty && item.isDefault)) && (
          <TableActionsMenu menu={actionsMenu} item={item} />
        )}
      </div>
    </div>
  )
}

JobsPanelTableRow.propTypes = {
  actionsMenu: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  item: PropTypes.shape({}).isRequired,
  row: PropTypes.shape({}).isRequired
}

export default JobsPanelTableRow
