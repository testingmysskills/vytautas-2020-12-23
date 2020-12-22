import { ChangeEvent } from 'react'
import { Button, LinearProgress } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import { useLazyUpload } from '../../hooks'

import styles from './styles.module.css'

const FileUploader = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { upload, loading, progress } = useLazyUpload({
    onUpload: () => {
      enqueueSnackbar('File successfully uploaded!', {
        variant: 'success'
      })
    },
    onError: (message) => {
      enqueueSnackbar(message, {
        variant: 'error'
      })
    }
  })

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target!.files

    if (files!.length > 0) {
      upload(files![0])
    }
  }

  return (
    <Button
      variant='contained'
      color='primary'
      component='label'
      disabled={loading}
      fullWidth
      className={styles.root}
    >
      Upload
      {loading && (
        <>
          <LinearProgress
            variant='determinate'
            value={progress}
            className={styles.progress}
          />
          <span className={styles.progressValue}>{progress}%</span>
        </>
      )}

      <input
        type='file'
        accept='.png,.jpg,.jpeg'
        hidden
        onChange={handleChange}
      />
    </Button>
  )
}

export default FileUploader
