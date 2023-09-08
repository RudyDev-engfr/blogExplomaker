import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'
import { useTheme } from '@mui/styles'

const ButtonSearch = ({ setSearchModal }) => {
  const theme = useTheme()

  return (
    <Box>
      <Button
        sx={{
          textTransform: 'none',
          '&:hover': {
            backgroundColor: theme.palette.primary.ultraLight,
          },
          color: theme.palette.grey.grey33,
          fontSize: '14px',
          border: '1px solid black',
          padding: '13px 18px',
          transition: '0.2s all',
          borderRadius: '40px',
        }}
        disableRipple
        variant="outlined"
        startIcon={<SearchIcon />}
        onClick={() => setSearchModal(true)}
      >
        Recherche...
      </Button>
    </Box>
  )
}
export default ButtonSearch
