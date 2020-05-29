import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import TableActionsMenu from '../../common/TableActionsMenu/TableActionsMenu'

import { has, map } from 'lodash'

import { joinDataOfArrayOrObject } from '../../utils'

import './jobsPanelTableRow.scss'

const JobsPanelTableRow = ({ actionsMenu, item }) => {
  return (
    <div className="table__row">
      {map(item.data, (value, property) => {
        return (
          <div
            className={`table__cell ${
              ((property === 'name' && has(item.data, 'value')) ||
                property === 'type') &&
              item.isDefault
                ? `table__cell-${property} table__cell_disabled`
                : `table__cell-${property}`
            }`}
            key={property}
          >
            <Tooltip
              className="data-ellipsis"
              textShow={property === 'name' && item.doc}
              template={
                <TextTooltipTemplate
                  text={
                    property === 'name'
                      ? item.doc
                      : joinDataOfArrayOrObject(value, ', ')
                  }
                />
              }
            >
              {joinDataOfArrayOrObject(value, ', ')}
            </Tooltip>
          </div>
        )
      })}
      <div className="table__cell actions_cell">
        {((!item.isValueEmpty && !item.isDefault) ||
          (item.isValueEmpty && item.isDefault)) && (
          <TableActionsMenu
            item={item}
            menu={actionsMenu}
            visible={
              (!item.data.isValueEmpty || !item.data.path) &&
              item.isDefault === true
            }
          />
        )}
      </div>
    </div>
  )
}

JobsPanelTableRow.propTypes = {
  actionsMenu: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  item: PropTypes.shape({}).isRequired
}

export default JobsPanelTableRow
