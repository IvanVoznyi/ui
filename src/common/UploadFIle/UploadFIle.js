import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as DropFileIcon } from '../../images/drop-file.svg'
import { ReactComponent as Warning } from '../../images/warning.svg'

import classnames from 'classnames'
import formatSize from 'pretty-bytes'

import './uploadFile.scss'
import Tooltip from '../Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

const UploadFile = ({ file, changeFile, required, requiredText }) => {
  const [isDragFile, setIsDragFile] = useState(false)

  const upLoadFileClassName = classnames(
    'uploadfile-container',
    isDragFile && 'onFocus',
    file && 'selected-file',
    required && 'uploadfile_required'
  )

  const handleDragEnter = event => {
    if (!file) {
      event.preventDefault()
      setIsDragFile(true)
    }
  }

  const handleDragOver = event => {
    if (!file) {
      event.preventDefault()
    }
  }

  const handleDragLeave = event => {
    if (!file) {
      event.preventDefault()
      setIsDragFile(false)
    }
  }

  const handleDrop = event => {
    if (!file) {
      event.preventDefault()
      setIsDragFile(false)
      const file = event.dataTransfer.files[0]
      changeFile(file)
    }
  }

  const handleChoseNewFile = () => {
    changeFile(null)
  }

  return (
    <div
      className={upLoadFileClassName}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <DropFileIcon />
      {!file ? (
        <div className="uploadfile-container__text">
          Drop file here or
          <span className="uploadfile-container__text-browse">browse</span>
        </div>
      ) : (
        <>
          <div className="uploadfile-container__file">
            <span className="uploadfile-container__file-name">
              File {file.name}
            </span>
            <span className="uploadfile-container__file-size">
              {`(${formatSize(file.size)})`}
            </span>
          </div>
          <div
            className="uploadfile-container__new-file"
            onClick={handleChoseNewFile}
          >
            Choose another file
          </div>
        </>
      )}
      {required && !isDragFile && (
        <Tooltip
          className="warning-container"
          template={<TextTooltipTemplate warning text={requiredText} />}
        >
          <Warning />
        </Tooltip>
      )}
    </div>
  )
}

UploadFile.propTypes = {
  file: PropTypes.oneOfType([PropTypes.shape({})]),
  changeFile: PropTypes.func.isRequired,
  required: PropTypes.bool,
  requiredText: PropTypes.string
}

export default UploadFile
