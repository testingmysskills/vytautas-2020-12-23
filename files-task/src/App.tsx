import { Container, Box } from '@material-ui/core'
import { SnackbarProvider } from 'notistack'
import { TopBar, UploadsList } from './components'
import { UploadsProvider } from './utils'

function App () {
  return (
    <UploadsProvider>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <Container maxWidth='md'>
          <Box mt={4} mb={4}>
            <TopBar />
          </Box>
          <UploadsList />
        </Container>
      </SnackbarProvider>
    </UploadsProvider>
  )
}

export default App
