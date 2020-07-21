import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useLayoutEffect,
  useRef
} from 'react'
import PropTypes from 'prop-types'

import Chip from '../Chip/Chip'
import Tooltip from '../Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import HiddenChipsBlock from '../../elements/HiddenChipsBlock/HiddenChipsBlock'

import { ReactComponent as Add } from '../../images/add.svg'

import { cutChips } from '../../utils/cutChips'
import { sizeChips } from './SizeChips'
import { panelActions } from '../../components/JobsPanel/panelReducer'

import './chipCell.scss'

const ChipCell = ({ className, elements, isEditMode, dispatch }) => {
  const [sizeContainer, setSizeContainer] = useState(0)
  const [show, setShow] = useState(false)
  const [editConfig, setEditConfig] = useState({
    chipIndex: null,
    isEdit: false,
    isKeyFocused: true,
    isValueFocused: false
  })
  const chipRef = useRef()

  let chips = useMemo(() => {
    return isEditMode
      ? {
          visibleChips: elements.map(chip => ({
            value: chip
          }))
        }
      : sizeContainer <= 1000
      ? sizeChips[sizeContainer](elements)
      : cutChips(elements, 8)
  }, [elements, isEditMode, sizeContainer])

  const handleShowElements = useCallback(() => {
    if (!isEditMode) {
      setShow(!show)
    }
  }, [show, isEditMode])

  useEffect(() => {
    if (show) {
      window.addEventListener('click', handleShowElements)
      return () => window.removeEventListener('click', handleShowElements)
    }
  }, [show, handleShowElements])

  const handleResize = useCallback(() => {
    if (!isEditMode) {
      if (chipRef.current) {
        const sizeParent =
          parseInt(chipRef.current.parentNode.offsetWidth / 100) * 100

        setSizeContainer(sizeParent)
      }
    }
  }, [isEditMode, chipRef])

  useLayoutEffect(() => {
    handleResize()
  }, [handleResize])

  useEffect(() => {
    if (!isEditMode) {
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [handleResize, isEditMode])

  const addChip = useCallback(
    chip => {
      if (!editConfig.isEdit && !editConfig.chipIndex) {
        dispatch({
          type: panelActions.SET_JOB_LABEL,
          payload: [...elements, chip]
        })
      }

      setEditConfig({
        chipIndex: elements.length - 1 + 1,
        isEdit: true,
        isKeyFocused: true,
        isValueFocused: false
      })
    },
    [dispatch, elements, editConfig]
  )

  const editChip = useCallback(
    (chip, isClick) => {
      const isChipEmpty = !!(chip.key && chip.value)

      if (isChipEmpty) {
        const newChips = [...elements]
        newChips[editConfig.chipIndex] = `${chip.key}: ${chip.value}`

        dispatch({
          type: panelActions.EDIT_JOB_LABEL,
          payload: newChips
        })
      }

      if (editConfig.chipIndex === elements.length - 1) {
        setEditConfig(prevState => ({
          chipIndex: !isChipEmpty ? prevState.chipIndex : null,
          isEdit: !isChipEmpty,
          isKeyFocused: true,
          isValueFocused: false
        }))
      } else {
        setEditConfig(prevState => ({
          ...prevState,
          chipIndex: !isClick ? prevState.chipIndex + 1 : null,
          isKeyFocused: !isClick ? prevState.isKeyFocused : true,
          isValueFocused: !isClick ? prevState.isValueFocused : false
        }))
      }
    },
    [editConfig, elements, dispatch]
  )

  const handleIsEdit = useCallback((event, index) => {
    event.stopPropagation()

    setEditConfig({
      chipIndex: index,
      isEdit: true,
      isKeyFocused: true,
      isValueFocused: false
    })
  }, [])

  const removeChip = useCallback(
    chipIndex => {
      const newChip = elements.filter((value, index) => index !== chipIndex)
      dispatch({
        type: panelActions.REMOVE_JOB_LABEL,
        payload: newChip
      })
    },
    [elements, dispatch]
  )

  return (
    (isEditMode || elements.length !== 0) && (
      <>
        <div className="chips-wrapper" ref={chipRef}>
          {chips.visibleChips.map((item, index) => {
            return (
              <div className={'chip-block'} key={`${item.value}${index}`}>
                <Tooltip
                  className="tooltip-wrapper"
                  key={item.value}
                  template={
                    editConfig.isEdit ? (
                      <span />
                    ) : (
                      <TextTooltipTemplate text={item.value} />
                    )
                  }
                >
                  <Chip
                    chipIndex={index}
                    className={className}
                    editConfig={editConfig}
                    editChip={editChip}
                    isEditMode={isEditMode}
                    handleIsEdit={handleIsEdit}
                    removeChip={removeChip}
                    onClick={handleShowElements}
                    setEditConfig={setEditConfig}
                    value={item.value}
                  />
                </Tooltip>
                {chips.visibleChips.length - 1 === index && show && (
                  <HiddenChipsBlock
                    className={className}
                    chips={chips.hiddenChips}
                  />
                )}
              </div>
            )
          })}
        </div>
        {isEditMode && (
          <button
            className="job-labels__button-add"
            onClick={() => addChip(':')}
          >
            <Add />
          </button>
        )}
      </>
    )
  )
}

ChipCell.defaultProps = {
  elements: []
}

ChipCell.propTypes = {
  className: PropTypes.string.isRequired,
  elements: PropTypes.arrayOf(PropTypes.string),
  isEditMode: PropTypes.bool,
  dispatch: PropTypes.func
}

export default React.memo(ChipCell)
