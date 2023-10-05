import { Close } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useContext } from 'react'
import { SessionContext } from '../../contexts/session'

import MobileSearchButton from '../atoms/MobileSearchButton'
import SearchModal from './SearchModal'

const MobileSearchLayout = ({ children, currentPath }) => {
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const { searchModal, setSearchModal } = useContext(SessionContext)
  return (
    <Box>
      {matchesXs && !currentPath.includes('/exploration') && <MobileSearchButton />}
      {matchesXs && !currentPath.includes('/exploration') && searchModal && (
        <IconButton
          variant="contained"
          onClick={() => setSearchModal(false)}
          sx={{
            position: 'fixed',
            bottom: '110px',
            left: 'calc(50% - 30px)',
            backgroundColor: theme.palette.primary.main,
            width: '60px',
            height: '60px',
            zIndex: 10002,
          }}
        >
          <Close sx={{ color: 'white' }} />
        </IconButton>
      )}
      {children}
      {searchModal && <SearchModal open={searchModal} setOpen={setSearchModal} />}
    </Box>
  )
}
export default MobileSearchLayout
