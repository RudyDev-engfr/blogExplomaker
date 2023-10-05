import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { makeStyles, useTheme } from '@mui/styles'
import Autocomplete from '../Algolia/Autocomplete'

const useStyles = makeStyles(theme => ({
  searchModalContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    height: 600,
    backgroundColor: 'background.paper',
    boxShadow: 24,
    borderRadius: '10px',
    [theme.breakpoints.down('sm')]: {
      width: '100vw',
      height: 'calc(100vh + 15px)',
      zIndex: 100001,
      top: '0',
      left: '0',
      transform: 'unset',
    },
  },
}))
const SearchModal = ({ open, setOpen }) => {
  const theme = useTheme()
  const classes = useStyles()

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="search-modal-title"
      aria-describedby="search-modal-description"
      disableScrollLock
      disableEnforceFocus
    >
      <Box className={classes.searchModalContent}>
        <Autocomplete setSearchModal={setOpen} />
      </Box>
    </Modal>
  )
}
export default SearchModal
