import React from 'react'
import Provider from 'react-redux/lib/components/Provider'
import { createStore } from 'redux'
import {
  act,
  cleanup,
  fireEvent,
  render as rtlRender
} from '@testing-library/react'

import Download from './Download'

import reducer from '../../reducers/reducers'
import { mainHttpClient } from '../../httpClient'

const render = (
  ui,
  {
    initialState,
    store = createStore(reducer, initialState),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

describe('Download component', () => {
  let wrapper

  beforeEach(() => {
    jest.clearAllMocks()
    const props = {
      user: 'admin',
      path: '/123/456/test.txt',
      fileName: 'test.txt'
    }
    global.URL.createObjectURL = jest.fn()
    wrapper = render(<Download {...props} />)
  })

  afterEach(cleanup)

  it('renders without crashing', () => {
    expect(wrapper.queryByTestId('download')).not.toBeNull()
  })

  it('should get a response from the request', async () => {
    const download = wrapper.getByTestId('download')

    const promise = Promise.resolve({
      status: 200,
      data: '12',
      config: { url: 'localhost' }
    })

    const handlerGet = jest
      .spyOn(mainHttpClient, 'get')
      .mockImplementation(() => promise)

    fireEvent.click(download)

    expect(handlerGet).toHaveBeenCalled()
    expect(handlerGet()).resolves.toEqual({
      status: 200,
      data: '12',
      config: { url: 'localhost' }
    })

    await act(() => promise)
  })

  it('should get a error from the request', async () => {
    const download = wrapper.getByTestId('download')

    const promise = Promise.reject(new Error('oops'))

    const handlerGet = jest
      .spyOn(mainHttpClient, 'get')
      .mockImplementation(() => promise)

    fireEvent.click(download)

    expect(handlerGet).toHaveBeenCalled()
    try {
      await act(() => promise)
    } catch {
      expect(handlerGet()).rejects.toEqual(new Error('oops'))
    }
  })
})
