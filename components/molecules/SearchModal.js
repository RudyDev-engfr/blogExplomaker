import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { makeStyles } from '@mui/styles'
import Autocomplete from '../Algolia/Autocomplete'

const useStyles = makeStyles(theme => ({}))
const SearchModal = ({ open, setOpen }) => {
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
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700,
          height: 600,
          backgroundColor: 'background.paper',
          boxShadow: 24,
          borderRadius: '10px',
        }}
      >
        <Autocomplete />
      </Box>
    </Modal>
  )
}
export default SearchModal
