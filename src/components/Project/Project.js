import React, { useCallback, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import classnames from 'classnames'
import _ from 'lodash'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import JobsAndWorkflows from '../JobsAndWorkflows/JobsAndWorkflows'
import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'
import RealTimeMLFunction from '../RealTimeMLFunctions/RealTimeMLFunctions'
import RegisterArtifactPopup from '../RegisterArtifactPopup/RegisterArtifactPopup'
import Select from '../../common/Select/Select'
import projectsAction from '../../actions/projects'

import projectApi from '../../api/projects-api'

import { ReactComponent as Jupyter } from '../../images/jupyter.svg'
import { ReactComponent as Settings } from '../../images/settings.svg'
import { ReactComponent as VSCode } from '../../images/vs-code.svg'

import './project.scss'

const Project = ({
  fetchProject,
  fetchProjectFunctions,
  fetchProjectJobs,
  match,
  projectStore,
  removeProject
}) => {
  const [isPopupDialogOpen, setIsPopupDialogOpen] = useState(false)
  const [newProjectData, setNewProjectData] = useState({
    name: {
      value: null,
      isEdit: false
    },
    description: {
      value: null,
      isEdit: false
    }
  })

  const project = projectStore.project
  const history = useHistory()
  const inputRef = React.createRef(null)

  const statusClassName = classnames(
    'project-container__left-panel-status__icon',
    project.data?.state
  )

  const launchIDEOptions = [
    {
      label: 'Jupyter',
      id: 'jupyter',
      icon: <Jupyter />
    },
    {
      label: 'VS Code',
      id: 'vsCode',
      icon: <VSCode />
    }
  ]

  const createNewOptions = [
    {
      label: 'Job',
      id: 'job'
    },
    {
      label: 'Register artifact',
      id: 'registerArtifact'
    }
  ]

  const closeEditMode = useCallback(() => {
    setNewProjectData(prevState => {
      return {
        name: {
          value: prevState.name.value || project.data.name,
          isEdit: false
        },
        description: {
          value: prevState.description.value || project.data.description,
          isEdit: false
        }
      }
    })
  }, [project])

  const handleSetProjectData = useCallback(() => {
    const data = {
      name: newProjectData.name.value || project.data.name,
      description: newProjectData.description.value || project.data.description
    }
    closeEditMode()
    projectApi.editProject(match.params.projectName, data)
    history.push(`/projects/${data.name}`)
  }, [closeEditMode, history, match, newProjectData, project])

  const handleDocumentClick = useCallback(
    event => {
      if (inputRef.current && !event.path.includes(inputRef.current)) {
        handleSetProjectData()
      }
    },
    [inputRef, handleSetProjectData]
  )

  useEffect(() => {
    fetchProject(match.params.projectName)
    return () => {
      removeProject()
    }
  }, [fetchProject, match.params.projectName, removeProject])

  useEffect(() => {
    if (newProjectData.name.isEdit || newProjectData.description.isEdit) {
      inputRef.current.focus()
      document.addEventListener('click', handleDocumentClick)
    }

    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [inputRef, newProjectData, handleDocumentClick])

  const handleLaunchIDE = useCallback(launch => {}, [])

  const handleCreateNew = useCallback(
    menuItem => {
      if (menuItem === 'job') {
        history.push(
          `/projects/${match.params.projectName}/jobs/monitor/create-new-job`
        )
      } else if (menuItem === 'registerArtifact') {
        setIsPopupDialogOpen(true)
      }
    },
    [match.params.projectName, history]
  )

  const handleOnChange = useCallback(
    event => {
      const inputName = event.target.name
      setNewProjectData(prevState => ({
        ...prevState,
        name: {
          ...prevState.name,
          value:
            inputName === 'name' ? inputRef.current.value : prevState.name.value
        },
        description: {
          ...prevState.description,
          value:
            inputName === 'description'
              ? inputRef.current.value
              : prevState.description.value
        }
      }))
    },
    [inputRef]
  )

  const handleEdit = useCallback(inputName => {
    setNewProjectData(prevState => ({
      ...prevState,
      name: {
        ...prevState.name,
        isEdit: inputName === 'name'
      },
      description: {
        ...prevState.description,
        isEdit: inputName === 'description'
      }
    }))
  }, [])

  const handleOnKeyDown = useCallback(
    event => {
      if (event.keyCode === 13) {
        handleSetProjectData()
      }
    },
    [handleSetProjectData]
  )

  return (
    <>
      <div className="project-header">
        <Breadcrumbs match={match} />
      </div>
      {project.loading ? (
        <Loader />
      ) : project.error ? (
        <div className="error_container">
          <h1>{project.error}</h1>
        </div>
      ) : _.isEmpty(project.data) ? (
        <NoData />
      ) : (
        <div className="project-container">
          <div className="project-container__left-panel">
            <div className="project-container__left-panel-project">
              <div className="project-container__left-panel-project-wrapper">
                <div
                  className="project-container__left-panel-project__name"
                  onClick={() => handleEdit('name')}
                >
                  {newProjectData.name.isEdit ? (
                    <input
                      type="text"
                      className="input"
                      name="name"
                      ref={inputRef}
                      value={newProjectData.name.value ?? project.data.name}
                      onChange={handleOnChange}
                      onKeyDown={handleOnKeyDown}
                    />
                  ) : (
                    newProjectData.name.value ?? project.data.name
                  )}
                </div>
                <Settings className="project-container__left-panel-project__settings" />
              </div>
              <div
                className="project-container__left-panel-project__description"
                onClick={() => handleEdit('description')}
              >
                {newProjectData.description.isEdit ? (
                  <input
                    type="text"
                    className="input"
                    name="description"
                    ref={inputRef}
                    value={
                      newProjectData.description.value ??
                      project.data.description ??
                      ''
                    }
                    onChange={handleOnChange}
                    onKeyDown={handleOnKeyDown}
                  />
                ) : (
                  newProjectData.description.value ?? project.data.description
                )}
              </div>
            </div>
            <div className="project-container__left-panel__divider"></div>
            {project.data.state && (
              <div className="project-container__left-panel-status">
                <span className="project-container__left-panel-status__label">
                  Status:
                </span>
                <i className={statusClassName}></i>
                <span className="project-container__left-panel-status__name">
                  {project.data.state}
                </span>
              </div>
            )}
            <div className="project-container__left-panel-owner">
              <span className="project-container__left-panel-owner__label">
                Owner:
              </span>
              <span>{project.data.owner}</span>
            </div>
            <div className="project-container__left-panel__divider"></div>
            <div className="project-container__left-panel-links">
              <div className="project-container__left-panel-links__label">
                Quick Links
              </div>
              <Link
                className="project-container__left-panel-links__link"
                to={`/projects/${match.params.projectName}/artifacts`}
              >
                Artifacts
              </Link>
              <Link
                className="project-container__left-panel-links__link"
                to={`/projects/${match.params.projectName}/jobs/monitor`}
              >
                Monitor jobs and workflows
              </Link>
              <Link
                className="project-container__left-panel-links__link"
                to={`/projects/${match.params.projectName}/jobs/schedule`}
              >
                Schedule jobs and workflows
              </Link>
            </div>
          </div>
          <div className="project-container__main-panel">
            <div className="project-container__main-panel__tool-bar">
              <Select
                className="project-container__main-panel__tool-bar__menu launch-menu"
                isButtonMenu
                label="Launch IDE"
                match={match}
                onClick={handleLaunchIDE}
                options={launchIDEOptions}
              />
              <Select
                className="project-container__main-panel__tool-bar__menu create-new-menu"
                isButtonMenu
                label="Create new"
                match={match}
                onClick={handleCreateNew}
                options={createNewOptions}
              />
            </div>
            <div className="project-container__main-panel__statistics-section">
              <JobsAndWorkflows
                fetchProjectJobs={fetchProjectJobs}
                jobs={projectStore.project.jobs}
                match={match}
              />
              <RealTimeMLFunction
                fetchProjectFunctions={fetchProjectFunctions}
                functions={projectStore.project.functions}
                match={match}
              />
            </div>
          </div>
        </div>
      )}
      {isPopupDialogOpen && (
        <RegisterArtifactPopup
          match={match}
          artifactFilter={{}}
          refresh={() => {
            history.push(`/projects/${match.params.projectName}/artifacts`)
          }}
          setIsPopupDialogOpen={setIsPopupDialogOpen}
        />
      )}
    </>
  )
}

Project.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default connect(projectStore => projectStore, projectsAction)(Project)
