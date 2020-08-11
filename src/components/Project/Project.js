import React, { useCallback, useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'

import ProjectView from './ProjectView'

import projectsAction from '../../actions/projects'
import projectsApi from '../../api/projects-api'
import {
  launchIDEOptions,
  getLinks,
  getCreateNewOptions
} from './project.utils'

import './project.scss'

const Project = ({
  fetchProject,
  fetchProjectFunctions,
  fetchProjectJobs,
  match,
  projectStore,
  removeProjectData
}) => {
  const [isPopupDialogOpen, setIsPopupDialogOpen] = useState(false)
  const [editProject, setEditProject] = useState({
    name: {
      value: null,
      isEdit: false
    },
    description: {
      value: null,
      isEdit: false
    }
  })
  const history = useHistory()

  const statusClassName = classnames(
    'project-container__left-panel-status__icon',
    projectStore.project.data?.state
  )

  const { links, createNewOptions } = useMemo(() => {
    const links = getLinks(match)
    const createNewOptions = getCreateNewOptions(
      history,
      match,
      setIsPopupDialogOpen
    )
    return {
      links,
      createNewOptions
    }
  }, [history, match, setIsPopupDialogOpen])

  useEffect(() => {
    fetchProject(match.params.projectName)

    return () => {
      removeProjectData()
    }
  }, [fetchProject, match.params.projectName, removeProjectData])

  const closeEditMode = useCallback(() => {
    setEditProject(prevState => {
      return {
        name: {
          value: prevState.name.value || projectStore.project.data.name,
          isEdit: false
        },
        description: {
          value:
            prevState.description.value ||
            projectStore.project.data.description,
          isEdit: false
        }
      }
    })
  }, [projectStore.project])

  const handleSetProjectData = useCallback(() => {
    const data = {
      name: editProject.name.value || projectStore.project.data.name,
      description:
        editProject.description.value || projectStore.project.data.description
    }

    closeEditMode()
    projectsApi.updateProject(match.params.projectName, data)
    history.push(`/projects/${data.name}`)
  }, [closeEditMode, editProject, history, match, projectStore.project])

  const handleDocumentClick = useCallback(
    event => {
      if (event.target.nodeName !== 'INPUT') {
        handleSetProjectData()
      }
    },
    [handleSetProjectData]
  )

  useEffect(() => {
    if (editProject.name.isEdit || editProject.description.isEdit) {
      document.addEventListener('click', handleDocumentClick)
    }

    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [editProject, handleDocumentClick])

  const handleEditProject = useCallback(inputName => {
    setEditProject(prevState => ({
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

  const handleLaunchIDE = useCallback(launch => {}, [])

  const handleOnChangeProject = useCallback(
    value => {
      setEditProject(prevState => ({
        ...prevState,
        name: {
          ...prevState.name,
          value: editProject.name.isEdit ? value : prevState.name.value
        },
        description: {
          ...prevState.description,
          value: editProject.description.isEdit
            ? value
            : prevState.description.value
        }
      }))
    },
    [editProject]
  )

  const handleOnKeyDown = useCallback(
    event => {
      if (event.keyCode === 13) {
        handleSetProjectData()
      }
    },
    [handleSetProjectData]
  )

  return (
    <ProjectView
      createNewOptions={createNewOptions}
      editProject={editProject}
      fetchProjectFunctions={fetchProjectFunctions}
      fetchProjectJobs={fetchProjectJobs}
      handleEditProject={handleEditProject}
      handleLaunchIDE={handleLaunchIDE}
      handleOnChangeProject={handleOnChangeProject}
      handleOnKeyDown={handleOnKeyDown}
      history={history}
      isPopupDialogOpen={isPopupDialogOpen}
      launchIDEOptions={launchIDEOptions}
      links={links}
      match={match}
      projectStore={projectStore}
      setIsPopupDialogOpen={setIsPopupDialogOpen}
      statusClassName={statusClassName}
    />
  )
}

Project.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default connect(projectStore => projectStore, projectsAction)(Project)
