import { useContext, useState } from 'react'
import { client, UploadsContext } from '../../utils'

interface Props {
  onDelete: () => void
  onError: (message: string) => void
}

const useLazyDelete = ({ onDelete, onError }: Props) => {
  const [loading, setLoading] = useState(false)
  const { deleteUpload } = useContext(UploadsContext)

  const deleteFile = async (name: string) => {
    setLoading(true)

    try {
      await client.delete(`/uploads/${name}`)

      setLoading(false)
      onDelete()
      deleteUpload(name)
    } catch (error) {
      onError('Error occurred. Please try again')
      setLoading(false)
    }
  }

  return { deleteFile, loading }
}

export default useLazyDelete
