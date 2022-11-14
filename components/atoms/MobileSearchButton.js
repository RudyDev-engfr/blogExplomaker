import { IconButton, Modal } from '@mui/material'
import { makeStyles } from '@mui/styles'
import SearchIcon from '@mui/icons-material/Search'
import { SearchBox } from 'react-instantsearch-hooks-web'

const useStyles = makeStyles(theme => ({}))

const ModalSearch = ({ modalState }) => (
  <Modal open={modalState === 'search'} disableScrollLock keepMounted>
    <SearchBox />
  </Modal>
)
const MobileSearchButton = ({ modalStateSetter, modalState }) => {
  const classes = useStyles()

  return (
    <>
      <IconButton variant="contained" color="primary" onClick={() => modalStateSetter('search')}>
        <SearchIcon />
      </IconButton>
      <ModalSearch modalState={modalState} />
    </>
  )
}
export default MobileSearchButton
