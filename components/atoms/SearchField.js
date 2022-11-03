import { useContext } from 'react'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import makeStyles from '@mui/styles/makeStyles'
import SearchIcon from '@mui/icons-material/Search'
import { useRouter } from 'next/router'

import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/styles'

import { SessionContext } from '../../contexts/session'

const useStyles = makeStyles({
  resultsInput: {
    height: '100%',
    borderRadius: '50px',
    backgroundColor: '#FFFFFF',
  },
  resultsTextfield: {
    marginRight: '15px',
  },
  headerInspiration: {},
  searchButton: {
    minHeight: '57px',
    height: '100%',
    padding: '11px 15px',
    borderRadius: '50px',
  },
  sizeMediumButton: {
    height: '100%',
  },
  navbarInput: {
    borderRadius: '50px',
    backgroundColor: '#FFFFFF',
    height: '45px',
  },
  filledInput: {
    width: '100%',
    display: 'none',
  },
  leMachinTruc: {
    border: 'unset',
  },
})

const SearchField = ({
  isNavbar = false,
  placeholder,
  className,
  rootInput,
  needBorder = true,
  needButtonOnMobile = false,
}) => {
  const classes = useStyles()
  const router = useRouter()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  const { searchValue, setSearchValue } = useContext(SessionContext)

  const handleSubmit = event => {
    event.preventDefault()
    router.push(`/results?SearchFront%5Bquery%5D=${searchValue}`)
  }

  return (
    <>
      {!isNavbar ? (
        <Box display="flex" alignItems="center" component="form" onSubmit={handleSubmit}>
          <TextField
            type="text"
            value={searchValue}
            variant="outlined"
            onChange={event => {
              setSearchValue(event.target.value)
            }}
            aria-label="Recherche"
            placeholder={placeholder}
            hiddenLabel
            margin="none"
            className={className}
            InputProps={{
              classes: { root: rootInput },
            }}
          />
          {(needButtonOnMobile || !matchesXs) && (
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              classes={{ root: classes.searchButton, sizeMedium: classes.sizeMediumButton }}
              type="submit"
            >
              Rechercher
            </Button>
          )}
        </Box>
      ) : (
        <Box width="340px" component="form" onSubmit={handleSubmit}>
          <TextField
            type="text"
            value={searchValue}
            variant="outlined"
            onChange={event => {
              setSearchValue(event.target.value)
            }}
            aria-label="Recherche"
            placeholder="Destination, article, passion..."
            hiddenLabel
            fullWidth
            margin="none"
            InputProps={{
              classes: { root: classes.navbarInput, filledInput: classes.filledInput },
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton type="submit" disabled={searchValue.length < 3}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}
    </>
  )
}

export default SearchField
