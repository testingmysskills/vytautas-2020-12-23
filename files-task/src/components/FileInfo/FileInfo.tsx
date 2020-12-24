import { ReactNode, useState } from 'react'
import {
  Card,
  CardHeader,
  CardMedia,
  IconButton,
  Typography,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@material-ui/core'
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import { useSnackbar } from 'notistack'
import { calculateFileSize } from '../../utils'
import { useLazyDelete } from '../../hooks'

import styles from './styles.module.css'

interface Props {
  name: string
  size: number
  highlight: ReactNode
}

interface AlertProps {
  onClose: () => void
  onDelete: () => void
}

const Alert = ({ onClose, onDelete }: AlertProps) => (
  <Dialog
    open
    onClose={onClose}
  >
    <DialogTitle>You are about to remove image</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Warning: the image will be removed premanantely from the server, are you sure you want to do this?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color='primary'>
        Cancel
      </Button>
      <Button onClick={onDelete} color='secondary' variant='contained' autoFocus>
        Delete
      </Button>
    </DialogActions>
  </Dialog>
)

const FileInfo = ({ name, size, highlight }: Props) => {
  const { enqueueSnackbar } = useSnackbar()
  const { deleteFile, loading } = useLazyDelete({
    onDelete: () => {
      enqueueSnackbar('File was successfully deleted!', {
        variant: 'success'
      })
    },
    onError: (message) => {
      enqueueSnackbar(message, {
        variant: 'error'
      })
    }
  })
  const [alertOpen, setAlertOpen] = useState(false)

  const handleOnDelete = () => {
    setAlertOpen(false)
    deleteFile(name)
  }

  return (
    <>
      <Card className={styles.root} data-testid={`upload-${name}`}>
        <CardMedia
          image={`http://localhost:3001/uploads/${name}`}
          title={name}
          className={styles.media}
          data-testid='media'
        />
        <CardHeader
          title={(
            <Typography variant='body1'>
              {highlight}
            </Typography>
          )}
          subheader={
            <Typography variant='caption'>{calculateFileSize(size)}</Typography>
          }
          action={
            <Tooltip title='Delete image'>
              <IconButton
                size='small'
                color='secondary'
                onClick={() => setAlertOpen(true)}
                disabled={loading}
                className={styles.wrapper}
                data-testid='delete-icon'
              >
                <DeleteOutline />
                {loading && (
                  <CircularProgress
                    size={30}
                    className={styles.progress}
                    data-testid='circular-progress'
                  />
                )}
              </IconButton>
            </Tooltip>
          }
        />
      </Card>
      {alertOpen && (
        <Alert
          onClose={() => { setAlertOpen(false) }}
          onDelete={handleOnDelete}
        />
      )}
    </>
  )
}

export default FileInfo
