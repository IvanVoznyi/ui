import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'

import Content from '../../layout/Content/Content'
import Loader from '../../common/Loader/Loader'
import parseTargetPath from '../../utils/parseTargetPath'
import RegisterArtifactForm from '../../elements/RegisterArtifactForm/RegisterArtifactForm'
import PopUpDialog from '../../common/PopUpDialog/PopUpDialog'
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage'

import artifactApi from '../../api/artifacts-api'
import artifactsAction from '../../actions/artifacts'
import artifactsData from './artifactsData'
import { generateArtifactPreviewData } from '../../utils/generateArtifactPreviewData'

import './artifacts.scss'

const Artifacts = ({
  artifactsStore,
  fetchArtifacts,
  history,
  match,
  removeArtifacts
}) => {
  const [artifacts, _setArtifacts] = useState([])
  const [selectedArtifact, setSelectedArtifact] = useState({})
  const [isPopupDialogOpen, setIsPopupDialogOpen] = useState(false)
  const [registerArtifactData, setRegisterArtifactData] = useState({
    description: '',
    kind: 'general',
    key: {
      value: '',
      required: false
    },
    target_path: {
      value: '',
      required: false
    },
    error: {
      message: ''
    }
  })

  const [pageData, setPageData] = useState({
    detailsMenu: artifactsData.detailsMenu,
    filters: artifactsData.filters,
    page: artifactsData.page,
    tableHeaders: artifactsData.tableHeaders
  })

  const fetchData = useCallback(
    item => {
      fetchArtifacts(item).then(data => {
        const artifacts = data
          .map(artifact => {
            let item = null

            if (artifact.link_iteration) {
              let { link_iteration } = artifact.link_iteration
              item = artifact.data.filter(
                item => item.iter === link_iteration
              )[0]
            } else {
              item = artifact.data[0]
            }
            if (item) {
              item.target_path = parseTargetPath(item.target_path)

              if (item.extra_data) {
                const generatedPreviewData = generateArtifactPreviewData(
                  item.extra_data,
                  item.target_path.schema
                )

                item.preview = generatedPreviewData.preview

                if (generatedPreviewData.extraDataPath) {
                  item.target_path.path = generatedPreviewData.extraDataPath
                }
              } else {
                item.preview = item.preview ?? []
              }
            }

            return item
          })
          .filter(item => item !== undefined)

        _setArtifacts(artifacts)
        return artifacts
      })
    },
    [fetchArtifacts]
  )

  useEffect(() => {
    fetchData({ tag: 'latest', project: match.params.projectName })

    return () => {
      _setArtifacts([])
      removeArtifacts()
    }
  }, [fetchData, match.params.projectName, removeArtifacts])

  useEffect(() => {
    if (
      match.params.name !== undefined &&
      artifactsStore.artifacts.length !== 0
    ) {
      const { name } = match.params

      const [searchItem] = artifactsStore.artifacts.filter(item => {
        return item.key === name
      })

      if (searchItem === undefined) {
        history.push(`/projects/${match.params.projectName}/artifacts`)
      } else {
        const [artifact] = searchItem.data.filter(item => {
          if (searchItem.link_iteration) {
            const { link_iteration } = searchItem.link_iteration
            return link_iteration === item.iter
          }
          return true
        })
        setSelectedArtifact({ item: artifact })
      }
    }
  }, [match.params, artifactsStore.artifacts, history])

  useEffect(() => {
    artifactApi.getArtifactTag(match.params.projectName)
  }, [match.params.projectName])

  const handleSelectArtifact = (item, preview) => {
    if (document.getElementsByClassName('view')[0]) {
      document.getElementsByClassName('view')[0].classList.remove('view')
    }
    setSelectedArtifact({ item })
  }

  useEffect(() => {
    if (match.params.tab === 'metadata' && !selectedArtifact.item?.schema) {
      history.push(
        `/projects/${match.params.projectName}/artifacts/${match.params.name}/info`
      )
    }

    setPageData(state => {
      if (selectedArtifact.item?.schema) {
        return {
          ...state,
          detailsMenu: [...artifactsData.detailsMenu, 'metadata']
        }
      }

      return {
        ...state,
        detailsMenu: artifactsData.detailsMenu
      }
    })
  }, [
    match.params.tab,
    match.params.projectName,
    match.params.name,
    history,
    selectedArtifact.item
  ])

  const resetRegisterArtifactForm = useCallback(() => {
    setRegisterArtifactData({
      description: '',
      kind: 'general',
      key: {
        value: '',
        required: false
      },
      target_path: {
        value: '',
        required: false
      },
      error: {
        message: ''
      }
    })
  }, [])

  const registerArtifact = useCallback(() => {
    if (
      !registerArtifactData.key.value ||
      !registerArtifactData.target_path.value
    ) {
      setRegisterArtifactData(prevData => ({
        ...prevData,
        key: {
          ...prevData.key,
          required: !registerArtifactData.key.value
        },
        target_path: {
          ...prevData.target_path,
          required: !registerArtifactData.target_path.value
        }
      }))
      return
    }

    if (registerArtifactData.error.message) {
      setRegisterArtifactData(prevData => ({
        ...prevData,
        error: { ...prevData.error, message: '' }
      }))
    }

    const uid = uuidv4()

    const data = {
      uid: uid,
      key: registerArtifactData.key.value,
      db_key: registerArtifactData.key.value,
      tree: uid,
      target_path: registerArtifactData.target_path.value,
      description: registerArtifactData.description,
      kind:
        registerArtifactData.kind === 'general'
          ? ''
          : registerArtifactData.kind,
      project: match.params.projectName,
      producer: {
        kind: 'api',
        uri: window.location.host
      }
    }

    if (registerArtifactData.kind === 'model') {
      const {
        target_path,
        model_file
      } = registerArtifactData.target_path.value.split('/').reduce(
        (prev, curr, index, arr) => {
          if (arr.length - 1 === index) {
            prev.model_file = curr
          } else {
            prev.target_path += `${curr}/`
          }
          return prev
        },
        { model_file: '', target_path: '' }
      )

      data.target_path = target_path
      data.model_file = model_file
    }

    artifactApi
      .registerArtifact(match.params.projectName, data)
      .then(() => {
        setIsPopupDialogOpen(false)
        resetRegisterArtifactForm()
        fetchData({ tag: 'latest', project: match.params.projectName })
      })
      .catch(err => {
        setRegisterArtifactData(prevData => ({
          ...prevData,
          error: {
            ...prevData.error,
            message: err.message
          }
        }))
      })
  }, [
    fetchData,
    match.params.projectName,
    registerArtifactData,
    resetRegisterArtifactForm
  ])

  const handleCancel = () => {
    setSelectedArtifact({})
  }

  const openPopupDialog = () => {
    setIsPopupDialogOpen(true)
  }

  const closePopupDialog = useCallback(() => {
    setIsPopupDialogOpen(false)
    resetRegisterArtifactForm()
  }, [resetRegisterArtifactForm])

  const closeErrorMessage = useCallback(() => {
    setRegisterArtifactData(prevData => ({
      ...prevData,
      error: {
        ...prevData.error,
        message: ''
      }
    }))
  }, [])

  return (
    <>
      {artifactsStore.loading && <Loader />}
      <Content
        content={artifacts}
        handleCancel={handleCancel}
        handleSelectItem={handleSelectArtifact}
        loading={artifactsStore.loading}
        match={match}
        pageData={pageData}
        refresh={fetchData}
        openPopupDialog={openPopupDialog}
        selectedItem={selectedArtifact.item}
        yamlContent={artifactsStore.artifacts}
      />
      {isPopupDialogOpen && (
        <PopUpDialog
          headerText="Register artifact"
          closePopUp={closePopupDialog}
        >
          <RegisterArtifactForm
            match={match}
            registerArtifactData={registerArtifactData}
            onChange={setRegisterArtifactData}
          />
          <div className="pop-up-dialog__buttons-container">
            {registerArtifactData.error.message && (
              <ErrorMessage
                closeError={closeErrorMessage}
                message={registerArtifactData.error.message}
              />
            )}
            <button
              className="btn_default pop-up-dialog__btn_cancel"
              onClick={closePopupDialog}
            >
              Cancel
            </button>
            <button
              className="btn_primary btn_success"
              onClick={registerArtifact}
            >
              Register
            </button>
          </div>
        </PopUpDialog>
      )}
    </>
  )
}

Artifacts.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default connect(
  artifactsStore => artifactsStore,
  artifactsAction
)(Artifacts)
