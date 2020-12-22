import { useState, useEffect, useContext } from 'react'
import { client, UploadsContext } from '../../utils'
import { useDebouncedCallback } from 'use-debounce'

interface Props {
  onError: (message: string) => void
}

const useUploads = ({ onError }: Props) => {
  const [loading, setLoading] = useState(true)
  const { uploads, setUploads, searchTerm } = useContext(UploadsContext)

  const debounced = useDebouncedCallback(async () => {
    try {
      setLoading(true)
      const { data } = await client.get('/uploads', {
        params: {
          searchTerm
        }
      })

      setUploads(data)
      setLoading(false)
    } catch (error) {
      onError('Error occurred. Please try again')
      setLoading(false)
    }
  }, 300)

  useEffect(() => {
    debounced.callback()
  }, [debounced, searchTerm])

  return { uploads, loading, searchTerm }
}

export default useUploads
