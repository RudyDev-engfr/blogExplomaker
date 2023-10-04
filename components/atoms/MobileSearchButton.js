import IconButton from '@mui/material/IconButton'
import { useTheme } from '@mui/styles'
import SearchIcon from '@mui/icons-material/Search'
import { useContext } from 'react'
import { SessionContext } from '../../contexts/session'

const MobileSearchButton = () => {
  const theme = useTheme()
  const { setSearchModal } = useContext(SessionContext)

  return (
    <>
      <IconButton
        onClick={() => setSearchModal(true)}
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
