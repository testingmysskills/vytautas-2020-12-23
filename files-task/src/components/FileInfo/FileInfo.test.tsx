import FileInfo from './FileInfo'

import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { useSnackbar } from 'notistack'
import { useLazyDelete } from '../../hooks'

jest.mock('notistack')
jest.mock('../../hooks')

interface PreparationProps {
  name: string
  size: number
  highlight: string
}
const prepare = ({ name, size }: PreparationProps) => {
  render(
    <FileInfo
      name={name}
      size={size}
      highlight={name}
    />
  )
}

let deleteFile
let enqueueSnackbar

beforeEach(() => {
  deleteFile = jest.fn()
  enqueueSnackbar = jest.fn()

  useSnackbar.mockReturnValue({
    enqueueSnackbar
  })
  useLazyDelete.mockReturnValue({
    deleteFile,
    loading: false
  })
})

beforeEach(() => {
  prepare({
    name: 'FileName',
    size: 1560
  })
})

it('renders file data properly', () => {
  expect(screen.getByText('FileName')).toBeInTheDocument()
  expect(screen.getByText('1.52 KB')).toBeInTheDocument()
  expect(screen.getByTestId('media')).toHaveStyle('background-image: url("http://localhost:3001/uploads/FileName")')
})

it('displays tooltip when delete icon is hovered', async () => {
  userEvent.hover(screen.getByTestId('delete-icon'))

  expect(await screen.findByText('Delete image')).toBeInTheDocument()
})

describe('when delete icon is clicked', () => {
  beforeEach(() => {
    userEvent.click(screen.getByTestId('delete-icon'))
  })

  it('shows confirmation modal', async () => {
    expect(await screen.findByText('You are about to remove image')).toBeInTheDocument()
  })

  describe('when action is confirmed', () => {
    beforeEach(async () => {
      userEvent.click(await screen.findByText('Delete'))
    })

    it('hides confirmation modal', async () => {
      expect(screen.queryByText(/You are about to remove image/)).not.toBeInTheDocument()
    })

    it('initiates file deletion when action is confirmed', async () => {
      expect(deleteFile).toHaveBeenCalledWith('FileName')
    })
  })
})

const getHookCallbacks = () => useLazyDelete.mock.calls[0][0]

it('displays error when error happen during deletion', () => {
  const { onError } = getHookCallbacks()

  onError('Error!')

  expect(enqueueSnackbar).toHaveBeenCalledWith('Error!', { variant: 'error' })
})

it('displays success message when file was deleted', () => {
  const { onDelete } = getHookCallbacks()

  onDelete()

  expect(enqueueSnackbar).toHaveBeenCalledWith('File was successfully deleted!', { variant: 'success' })
})
