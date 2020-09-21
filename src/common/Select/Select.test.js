import React from 'react'

import Select from './Select'

import { render, cleanup, fireEvent } from '@testing-library/react'

jest.mock('../../images/dropdown.svg', () => ({
  ReactComponent: 'caret-icon'
}))

const renderComponent = props => render(<Select {...props} />)

describe('Select component', () => {
  let utils
  const mockClick = jest.fn()

  beforeEach(() => {
    const props = {
      label: 'Select',
      floatingLabel: true,
      selectedId: 'test1',
      onClick: mockClick,
      options: [{ label: 'Test1', id: 'test1', subLabel: 'test sub label' }]
    }
    utils = renderComponent(props)
  })

  afterEach(cleanup)

  it('renders without crashing', () => {
    expect(utils.getByTestId('select')).not.toBeNull()
  })

  it('should show select body after click by select header', () => {
    const select = utils.getByTestId('select')

    fireEvent.click(select)
    expect(utils.getByTestId('select-body')).not.toBeNull()
  })

  it('should hide the select body when scrolling', () => {
    const select = utils.getByTestId('select')

    fireEvent.click(select)

    expect(utils.getByTestId('select-body')).not.toBeNull()

    fireEvent.scroll(window)

    expect(
      utils.container.querySelector('[data-testid="select-body"]')
    ).toBeNull()
  })

  it('should call "onClick" callback with "test1"', () => {
    const select = utils.getByTestId('select')

    fireEvent.click(select)

    const selectOption = utils.getByTestId('select-option')

    fireEvent.click(selectOption)

    expect(mockClick).toHaveBeenCalledWith('test1')
  })

  it('should not close "selectBody" if click by disabled option', () => {
    const props = {
      options: [{ label: 'Test1', id: 'test1' }],
      disabledOptions: ['test1']
    }
    utils.rerender(<Select {...props} />)

    const select = utils.getByTestId('select')

    fireEvent.click(select)

    const selectOption = utils.getByTestId('select-option')

    fireEvent.click(selectOption)

    expect(utils.getByTestId('select-body')).not.toBeNull()
  })

  it('should display selected option', () => {
    const select = utils.getByTestId('select')

    fireEvent.click(select)

    const selectOption = utils.getByTestId('select-option')

    fireEvent.click(selectOption)

    expect(mockClick).toHaveBeenCalledWith('test1')

    utils.rerender(
      <Select options={[{ label: 'Test1', id: 'test1' }]} selectedId="test1" />
    )

    const selectedOption = utils.getByTestId('selected-option')

    expect(selectedOption.textContent).toEqual('Test1')
  })

  it('should add className "select__label_floating" to select label if props floatingLabel "true"', () => {
    expect(utils.getByTestId('select-label').className).toMatch(
      'select__label_floating'
    )
  })

  it('should not open select body if props disabled set to "true"', () => {
    utils.rerender(
      <Select options={[{ label: 'Test1', id: 'test1' }]} disabled={true} />
    )

    const select = utils.getByTestId('select')

    fireEvent.click(select)

    expect(
      utils.container.querySelector('[data-testid="select-body"]')
    ).toBeNull()
  })

  it('should display a "subLabel" if it exists in the option', () => {
    const subLabel = utils.getByTestId('select-subLabel')

    expect(subLabel).not.toBeNull()
  })

  it('should call handler callback if it exists in the option', () => {
    const mockHandler = jest.fn()
    utils.rerender(
      <Select
        options={[{ label: 'Test1', id: 'test1', handler: mockHandler }]}
      />
    )

    const select = utils.getByTestId('select')

    fireEvent.click(select)

    const selectOption = utils.getByTestId('select-option')

    fireEvent.click(selectOption)

    expect(mockHandler).toHaveBeenCalled()
  })
})
