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
      {children}
      {searchModal && <SearchModal open={searchModal} setOpen={setSearchModal} />}
    </Box>
  )
}
export default MobileSearchLayout
