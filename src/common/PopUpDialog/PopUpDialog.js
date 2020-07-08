import React from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as Close } from '../../images/close.svg'

import './popUpDialog.scss'

const PopUpDialog = ({ headerText, children, closePopUp }) => {
  return (
    <div className="pop-up-dialog__overlay">
      <div className="pop-up-dialog">
        <div className="pop-up-dialog__header">
          {headerText && (
            <div className="pop-up-dialog__header-text">{headerText}</div>
          )}
          <Close className="pop-up-dialog__header-close" onClick={closePopUp} />
        </div>
        {children}
      </div>
    </div>
  )
}

PopUpDialog.propTypes = {
  headerText: PropTypes.string,
  closePopUp: PropTypes.func.isRequired
}

export default PopUpDialog
