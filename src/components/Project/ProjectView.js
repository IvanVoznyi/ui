import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { isEmpty } from 'lodash'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import ProjectJobs from '../ProjectJobs/ProjectJobs'
import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'
import RealTimeMLFunctions from '../ProjectFunctions/ProjectFunctions'
import RegisterArtifactPopup from '../RegisterArtifactPopup/RegisterArtifactPopup'
import Select from '../../common/Select/Select'

import { ReactComponent as Settings } from '../../images/settings.svg'
import Input from '../../common/Input/Input'

const ProjectView = ({
  createNewOptions,
  editProject,
  fetchProjectFunctions,
  fetchProjectJobs,
  handleEditProject,
  handleLaunchIDE,
  handleOnChangeProject,
  handleOnKeyDown,
  history,
  isPopupDialogOpen,
  launchIDEOptions,
  links,
  match,
  projectStore,
  setIsPopupDialogOpen,
  statusClassName
}) => {
  return (
    <>
      <div className="project__header">
        <Breadcrumbs match={match} />
      </div>
      {projectStore.project.loading ? (
        <Loader />
      ) : projectStore.project.error ? (
        <div className=" project__error-container">
          <h1>{projectStore.project.error}</h1>
        </div>
      ) : isEmpty(projectStore.project.data) ? (
        <NoData />
      ) : (
        <div className="project__content">
          <div className="project__general-info">
            <div className="project__general-info-project">
              <div className="project__general-info-project-wrapper">
                <div
                  className="project__general-info-project__name"
                  onClick={() => handleEditProject('name')}
                >
                  {editProject.name.isEdit ? (
                    <Input
                      className="input"
                      name="name"
                      onChange={handleOnChangeProject}
                      onKeyDown={handleOnKeyDown}
                      type="text"
                      focused={true}
                      value={
                        editProject.name.value ?? projectStore.project.data.name
                      }
                    />
                  ) : (
                    editProject.name.value ?? projectStore.project.data.name
                  )}
                </div>
                <Settings className="project__general-info-project__settings" />
              </div>
              <div
                className="project__general-info-project__description"
                onClick={() => handleEditProject('description')}
              >
                {editProject.description.isEdit ? (
                  <Input
                    className="input"
                    name="description"
                    onChange={handleOnChangeProject}
                    onKeyDown={handleOnKeyDown}
                    focused={true}
                    type="text"
                    value={
                      editProject.description.value ??
                      projectStore.project.data.description
                    }
                  />
                ) : (
                  editProject.description.value ??
                  projectStore.project.data.description
                )}
              </div>
            </div>
            <div className="project__general-info__divider"></div>
            {projectStore.project.data.state && (
              <div className="project__general-info-status">
                <span className="project__general-info-status__label">
                  Status:
                </span>
                <i className={statusClassName}></i>
                <span className="project__general-info-status__name">
                  {projectStore.project.data.state}
                </span>
              </div>
            )}
            <div className="project__general-info-owner">
              <span className="project__general-info-owner__label">Owner:</span>
              <span>{projectStore.project.data.owner}</span>
            </div>
            <div className="project__general-info__divider"></div>
            <div className="project__general-info-links">
              <div className="project__general-info-links__label">
                Quick Links
              </div>
              {links.map(({ label, link }) => {
                return (
                  <Link
                    key={label}
                    className="project__general-info-links__link"
                    to={link}
                  >
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="project__main-info">
            <div className="project__main-info__tool-bar">
              <Select
                className="project__main-info__tool-bar__menu launch-menu"
                hideLabel
                label="Launch IDE"
                match={match}
                onClick={handleLaunchIDE}
                options={launchIDEOptions}
              />
              <Select
                className="project__main-info__tool-bar__menu create-new-menu"
                hideLabel
                label="Create new"
                match={match}
                options={createNewOptions}
              />
            </div>
            <div className="project__main-info__statistics-section">
              <ProjectJobs
                fetchProjectJobs={fetchProjectJobs}
                jobs={projectStore.project.jobs}
                match={match}
              />
              <RealTimeMLFunctions
                fetchProjectFunctions={fetchProjectFunctions}
                functionsStore={projectStore.project.functions}
                match={match}
              />
            </div>
          </div>
        </div>
      )}
      {isPopupDialogOpen && (
        <RegisterArtifactPopup
          artifactFilter={{}}
          match={match}
          refresh={() => {
            history.push(`/projects/${match.params.projectName}/artifacts`)
          }}
          setIsPopupDialogOpen={setIsPopupDialogOpen}
        />
      )}
    </>
  )
}

ProjectView.propTypes = {
  createNewOptions: PropTypes.array.isRequired,
  editProject: PropTypes.shape({}).isRequired,
  fetchProjectFunctions: PropTypes.func.isRequired,
  fetchProjectJobs: PropTypes.func.isRequired,
  handleEditProject: PropTypes.func.isRequired,
  handleLaunchIDE: PropTypes.func.isRequired,
  handleOnChangeProject: PropTypes.func.isRequired,
  handleOnKeyDown: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired,
  isPopupDialogOpen: PropTypes.bool.isRequired,
  launchIDEOptions: PropTypes.array.isRequired,
  links: PropTypes.array.isRequired,
  match: PropTypes.shape({}).isRequired,
  projectStore: PropTypes.shape({}).isRequired,
  setIsPopupDialogOpen: PropTypes.func.isRequired,
  statusClassName: PropTypes.string.isRequired
}

export default ProjectView
