import useLazyDelete from './useLazyDelete'
import { UploadsContext, client } from '../../utils'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import moxios from 'moxios'

interface TestProps {
  onDelete: () => void
  onError: (message: string) => void
}

const TestComponent = ({ onDelete, onError }: TestProps) => {
  const { deleteFile, loading } = useLazyDelete({ onDelete, onError })

  return (
    <div>
      <button onClick={() => {
        deleteFile('Test')
      }}>
        Delete
      </button>
      {loading ? 'Loading' : 'Not loading'}
    </div>
  )
}

interface PreparationProps {
  onDelete?: () => void
  onError?: (message: string) => void
  deleteUpload?: (name: string) => void
}

const noop = jest.fn()
const prepare = ({ onDelete = noop, onError = noop, deleteUpload = noop }: PreparationProps) => {
  render(
    <UploadsContext.Provider
      value={{
        uploads: [],
        setUploads: noop,
        addUpload: noop,
        deleteUpload,
        searchTerm: '',
        setSearchTerm: noop
      }}
    >
      <TestComponent
        onDelete={onDelete}
        onError={onError}
      />
    </UploadsContext.Provider>
  )
}

beforeEach(() => {
  moxios.install(client as any)
})

afterEach(() => {
  moxios.uninstall(client as any)
})

const respond = async (status: number = 200) => {
  await moxios.wait(jest.fn())

  await act(async () => {
    const request = moxios.requests.mostRecent()

    await request.respondWith({
      status,
      response: []
    })

    return {
      request
    }
  })
}

describe('deleteFile(name) method', () => {
  let deleteUpload
  let onDelete
  let onError

  beforeEach(() => {
    deleteUpload = jest.fn()
    onDelete = jest.fn()
    onError = jest.fn()

    prepare({ onDelete, onError, deleteUpload })
  })

  it('initially sets falsy loading state', async () => {
    expect(screen.getByText('Not loading')).toBeInTheDocument()
  })

  it('toggles loading state to true when delete is invoked', async () => {
    userEvent.click(screen.getByText('Delete'))

    expect(screen.getByText('Loading')).toBeInTheDocument()
  })

  it('makes correct call to API', (done) => {
    userEvent.click(screen.getByText('Delete'))

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()

      expect(request.url).toEqual('/uploads/Test')
      done()
    })
  })

  describe('when API responds successfully', () => {
    beforeEach(async () => {
      userEvent.click(screen.getByText('Delete'))

      await respond()
    })

    it('sets falsy loading state', () => {
      expect(screen.getByText('Not loading')).toBeInTheDocument()
    })

    it('calls onDelete callback', () => {
      expect(onDelete).toHaveBeenCalled()
    })

    it('calls deleteUpload on context', () => {
      expect(deleteUpload).toHaveBeenCalledWith('Test')
    })
  })

  describe('when API responds unsuccessfully', () => {
    beforeEach(async () => {
      userEvent.click(screen.getByText('Delete'))

      await respond(400)
    })

    it('resets loading state when API response', async () => {
      expect(screen.getByText('Not loading')).toBeInTheDocument()
    })

    it('calls onError callback', () => {
      expect(onError).toHaveBeenCalledWith('Error occurred. Please try again')
    })
  })
})
