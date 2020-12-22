import { Grid, TextField } from '@material-ui/core'
import { FileUploader } from '../../components'
import styles from './styles.module.css'
import { useContext } from 'react'
import { UploadsContext } from '../../utils'

const TopBar = () => {
  const { setSearchTerm, searchTerm } = useContext(UploadsContext)

  return (
    <Grid container spacing={4} className={styles.grid}>
      <Grid item md={8} xs={12}>
        <TextField
          label='Search documents...'
          variant='outlined'
          fullWidth
          size='small'
          value={searchTerm || ''}
          onChange={(event) => {
            setSearchTerm(event.target.value || null)
          }}
        />
      </Grid>
      <Grid item md={4} xs={12}>
        <FileUploader />
      </Grid>
    </Grid>
  )
}

export default TopBar
