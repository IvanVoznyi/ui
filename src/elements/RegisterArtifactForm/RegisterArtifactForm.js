import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'

import './registerArtifactForm.scss'

const RegisterArtifactForm = ({ match, onChange, registerArtifactData }) => {
  const { description, key, kind, target_path } = registerArtifactData

  const KindOptions = [
    {
      label: 'General',
      id: 'general'
    },
    {
      label: 'Chart',
      id: 'chart'
    },
    {
      label: 'Dataset',
      id: 'dataset'
    },
    {
      label: 'Model',
      id: 'model'
    },
    {
      label: 'Plot',
      id: 'plot'
    },
    {
      label: 'Table',
      id: 'table'
    }
  ]

  return (
    <div className="artifact-register-form">
      <Input
        floatingLabel
        label="Key"
        onChange={value =>
          onChange(prevData => ({
            ...prevData,
            key: { value, required: !value }
          }))
        }
        required={key.required}
        requiredText="This fields is required"
        type="text"
        value={key.value}
      />
      <Input
        floatingLabel
        label="Target Path"
        onChange={value =>
          onChange(prevData => ({
            ...prevData,
            target_path: { value, required: !value }
          }))
        }
        required={target_path.required}
        requiredText="This fields is required"
        type="text"
        value={target_path.value}
      />
      <Input
        floatingLabel
        label="Description"
        onChange={value =>
          onChange(prevData => ({ ...prevData, description: value }))
        }
        type="text"
        value={description}
      />
      <Select
        label="Kind"
        match={match}
        onClick={value => onChange(prevData => ({ ...prevData, kind: value }))}
        options={KindOptions}
        selectedId={kind}
      />
    </div>
  )
}

RegisterArtifactForm.propTypes = {
  match: PropTypes.shape({}).isRequired,
  registerArtifactData: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired
}

export default RegisterArtifactForm
