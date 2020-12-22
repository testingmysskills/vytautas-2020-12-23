import { useCallback } from 'react'
import { Grid, Typography } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import Highlighter from 'react-highlight-words'
import { FileInfo, FileInfoLoader } from '../../components'
import { useUploads } from '../../hooks'
import { calculateFileSize, Upload } from '../../utils'

import styles from './styles.module.css'

const LoadersArray = new Array(3).fill(undefined)
interface LoaderProps {
  active: boolean
}
const FileInfoLoaders = ({ active }: LoaderProps) => (
  <>
    {LoadersArray.map((_, index) => (
      <Grid md={4} xs={12} item key={index}>
        <FileInfoLoader active={active} />
      </Grid>
    ))}
  </>
)

const EmptyState = () => (
  <div className={styles.emptyState}>
    <Typography align='center'>
      Sorry no uploads have been found! Try uploading something first
    </Typography>
  </div>
)

const UploadsList = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { uploads, loading, searchTerm } = useUploads({
    onError: useCallback((message) => {
      enqueueSnackbar(message, {
        variant: 'error'
      })
    }, [enqueueSnackbar])
  })

  const totalSize = uploads.reduce((acc, upload: Upload) => acc + upload.size, 0)

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Grid container spacing={2}>
          <Grid md={8} xs={12} item>
            <Typography variant='h5'>
              {uploads.length} documents
            </Typography>
          </Grid>
          <Grid md={4} xs={12} item>
            <Typography variant='h5'>
              Total size: <strong>{calculateFileSize(totalSize)}</strong>
            </Typography>
          </Grid>
        </Grid>
      </div>
      <div className={styles.list}>
        <Grid container spacing={2}>
          {!loading && uploads.map(({ name, size }) => (
            <Grid md={4} xs={12} item key={name + size}>
              <FileInfo
                highlight={(
                  <Highlighter
                    searchWords={[searchTerm as string]}
                    textToHighlight={name}
                  />
                )}
                name={name}
                size={size}
              />
            </Grid>
          ))}
          {(!uploads.length || loading) && (
            <FileInfoLoaders active={loading} />
          )}
        </Grid>
        {!uploads.length && !loading && (
          <EmptyState />
        )}
      </div>
    </div>
  )
}

export default UploadsList
