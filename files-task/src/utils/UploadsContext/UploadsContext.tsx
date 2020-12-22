import { createContext, useState, useEffect, ReactNode } from 'react'

export interface Upload {
  name: string
  size: number
}
export type Uploads = Upload[]
interface ContextType {
  uploads: Uploads
  setUploads: (state: Uploads) => void
  addUpload: (name: string, size: number) => void
  deleteUpload: (name: string) => void,
  searchTerm: string | null,
  setSearchTerm: (searchTerm: string | null) => void
}

const UploadsContext = createContext<ContextType>({
  uploads: [],
  setUploads: (state) => {},
  addUpload: (name, size) => {},
  deleteUpload: (name) => {},
  searchTerm: null,
  setSearchTerm: (searchTerm) => {}
})

interface Props {
  children: ReactNode
}

const findUploadIndex = (uploads: Uploads, lookupName: string) => {
  return uploads.findIndex(({ name }) => name === lookupName)
}

const ALLOWED_SEARCH = /^[\w\-\s.]*$/i
const SANITIZED_SEARCH_REGEX = /searchTerm=([\w\-\s.]*)/gi
const MAX_FILE_NAME_LENGTH = 20

const getSanitizedSearchTerm = () => {
  const [, searchTerm] = SANITIZED_SEARCH_REGEX.exec(document.location.search) || []

  return searchTerm
}

const NON_ALPHANUMERIC = /[^a-zA-Z\d_\-:]/gi
const EXTENSIONS = /\..*/

const getSanitizedName = (name: string) => {
  return name
    .replace(EXTENSIONS, '')
    .replace(NON_ALPHANUMERIC, '')
    .substring(0, MAX_FILE_NAME_LENGTH)
}

const updateQuery = (searchTerm: string | null) => {
  const searchParams = new URLSearchParams(window.location.search)
  let newPath = window.location.pathname

  if (searchTerm) {
    searchParams.set('searchTerm', searchTerm)

    newPath = `${newPath}?${searchParams.toString()}`
  }

  window.history.pushState(null, '', newPath)
}

export const Provider = ({ children }: Props) => {
  const [searchTerm, setSearchTermValue] = useState<string | null>(null)
  const [uploads, setUploads] = useState<Uploads>([])

  useEffect(() => {
    const searchTerm = getSanitizedSearchTerm()

    if (searchTerm) {
      setSearchTermValue(searchTerm)
    }
  }, [])

  const setSearchTerm = (searchTerm: string | null) => {
    if (!ALLOWED_SEARCH.test(searchTerm as string)) {
      return
    }
    updateQuery(searchTerm)
    setSearchTermValue(searchTerm)
  }

  const addUpload = (name: string, size: number) => {
    const uploadIndex = findUploadIndex(uploads, name)
    const duplicateExists = uploadIndex > -1

    if (duplicateExists) {
      return
    }

    // We need to fetch full list
    if (searchTerm) {
      setSearchTerm(null)
      return
    }

    const updatedUploads = [
      ...uploads,
      {
        name: getSanitizedName(name),
        size
      }
    ]

    setUploads(updatedUploads)
  }
  const deleteUpload = (name: string) => {
    const uploadIndex = findUploadIndex(uploads, name)

    if (uploadIndex < 0) {
      return
    }

    uploads.splice(uploadIndex, 1)

    setUploads([...uploads])
  }

  return (
    <UploadsContext.Provider
      value={{
        uploads,
        setUploads,
        addUpload,
        deleteUpload,
        searchTerm,
        setSearchTerm
      }}
    >
      {children}
    </UploadsContext.Provider>
  )
}

export default UploadsContext
