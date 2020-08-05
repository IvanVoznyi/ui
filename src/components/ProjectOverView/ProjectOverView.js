import React, { useCallback, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import classnames from 'classnames'

import Loader from '../../common/Loader/Loader'
import Select from '../../common/Select/Select'

import { ReactComponent as Settings } from '../../images/settings.svg'
import { ReactComponent as Jupyter } from '../../images/jupyter.svg'
import { ReactComponent as VSCode } from '../../images/vs-code.svg'

import JobsAndWorkflows from '../JobsAndWorkflows/JobsAndWorkflows'

import projectsApi from '../../api/projects-api'

import './projectOverView.scss'
import RealTimeMLFunction from '../RealTimeMLFunctions/RealTimeMLFunctions'
import RegisterArtifactPopup from '../RegisterArtifactPopup/RegisterArtifactPopup'

const ProjectOverView = ({ match }) => {
  const [project, setProject] = useState({
    data: null,
    error: null
  })
  const [isPopupDialogOpen, setIsPopupDialogOpen] = useState(false)
  const history = useHistory()

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

  useEffect(() => {
    const { request, cancelRequest } = projectsApi.getProjectOverView(
      match.params.projectName
    )

    request
      .then(({ data }) => {
        setProject({ data: data.project })
      })
      .catch(error => {
        if (!error.message) return //axios sends error when canceling request
        setProject({ error: error.response.data })
      })

    return () => {
      cancelRequest()
    }
  }, [match.params.projectName])

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

  return !project.data && !project.error ? (
    <Loader />
  ) : project.error ? (
    <div className="error_container">
      <h1>Sorry, something went wrong</h1>
    </div>
  ) : (
    <>
      <div className="project-container">
        <div className="project-container__left-panel">
          <div className="project-container__left-panel-project">
            <div className="project-container__left-panel-project-wrapper">
              <div className="project-container__left-panel-project__name">
                {project.data.name}
              </div>
              <Settings className="project-container__left-panel-project__settings" />
            </div>
            <div className="project-container__left-panel-project__description">
              {project.data.desription}
            </div>
          </div>
          <div className="project-container__left-panel__divider"></div>
          {project.data.state && (
            <div className="project-container__left-panel-status">
              <span className="project-container__left-panel-status__label">
                Status:
              </span>
              <i className={statusClassName}></i>
              <span>{project.data.state}</span>
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
              match={match}
              menu
              label="Launch IDE"
              selectType="icon"
              onClick={handleLaunchIDE}
              options={launchIDEOptions}
            />
            <Select
              className="project-container__main-panel__tool-bar__menu create-new-menu"
              match={match}
              menu
              label="Create new"
              onClick={handleCreateNew}
              options={createNewOptions}
            />
          </div>
          <div className="project-container__main-panel__statistics-section">
            <JobsAndWorkflows match={match} />
            <RealTimeMLFunction match={match} />
          </div>
        </div>
      </div>
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

export default ProjectOverView
