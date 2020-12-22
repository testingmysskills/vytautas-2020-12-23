import { useContext, useState } from 'react'
import { client, UploadsContext } from '../../utils'

const MEGA_BYTE = 1024 * 1024
const FILE_SIZE_LIMIT = 20 * MEGA_BYTE
const ALLOWED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg'
]

interface Props {
  onUpload: () => void,
  onError: (message: string) => void
}

const prepareFormData = (file: any) => {
  const formData = new FormData()
  formData.append('file', file)

  return formData
}

const useLazyUpload = ({ onUpload, onError }: Props) => {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { addUpload } = useContext(UploadsContext)

  const upload = async (file: any) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      onError('File type is not allowed!')
      return
    }
    if (file.size > FILE_SIZE_LIMIT) {
      onError('File size is too big!')
      return
    }

    setLoading(true)

    try {
      await client.post('/upload', prepareFormData(file), {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (event: ProgressEvent) => {
          const progressValue = Math.round((event.loaded / event.total) * 100)

          setProgress(progressValue)
        }
      })

      setProgress(0)
      setLoading(false)
      onUpload()
      addUpload(file.name, file.size)
    } catch (error) {
      onError('Error occurred. Please try again')
      setLoading(false)
    }
  }

  return { upload, loading, progress }
}

export default useLazyUpload
