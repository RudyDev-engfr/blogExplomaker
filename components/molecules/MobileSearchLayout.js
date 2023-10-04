import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import MobileSearchButton from '../atoms/MobileSearchButton'

const MobileSearchLayout = ({ children, currentPath }) => {
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <Box>
      {matchesXs && !currentPath.includes('/exploration') && <MobileSearchButton />}
      {children}
    </Box>
  )
}
export default MobileSearchLayout
