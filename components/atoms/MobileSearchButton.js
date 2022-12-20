import { IconButton, Modal } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import SearchIcon from '@mui/icons-material/Search'
import { useRouter } from 'next/router'

const useStyles = makeStyles(theme => ({}))

const MobileSearchButton = () => {
  const router = useRouter()
  const theme = useTheme()

  return (
    <>
      <IconButton
        onClick={() => router.push('/results')}
        sx={{
          position: 'fixed',
          bottom: '110px',
          left: 'calc(50% - 30px)',
          backgroundColor: theme.palette.primary.main,
          width: '60px',
          height: '60px',
          zIndex: 10,
        }}
      >
        <SearchIcon sx={{ color: 'white' }} />
      </IconButton>
    </>
  )
}
export default MobileSearchButton
