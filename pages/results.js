import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'

import algoliasearch from 'algoliasearch'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import SearchIcon from '@mui/icons-material/Search'

import { Configure, InstantSearch, SearchBox } from 'react-instantsearch-hooks-web'
import { history } from 'instantsearch.js/es/lib/routers'

import Search from '../components/molecules/Search'

const useStyles = makeStyles(theme => ({
  mainContainer: {
    padding: '60px 0',
    background: `url(../../images/BKG.png)`,
    backgroundSize: 'cover',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100vw',
      margin: '0',
      position: 'relative',
      top: '-50px',
    },
  },
  resultHeaderContainer: {
    maxWidth: '1140px',
    margin: 'auto',
  },
  resultsLabel: {
    marginBottom: '15px',
    color: theme.palette.secondary.contrastText,
    fontSize: '22px',
    fontWeight: '500',
  },
  searboxRoot: {
    marginRight: '15px',
  },
  searchInput: {
    minWidth: '400px',
    minHeight: '45px',
    borderRadius: '50px',
    border: 'none',
    padding: '15px',
    fontSize: '17px',
  },
  searchSubmit: {
    display: 'none',
  },
  searchReset: {
    display: 'none',
  },
}))

function SubmitIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 18">
      <g
        fill="none"
        fillRule="evenodd"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.67"
        transform="translate(1 1)"
      >
        <circle cx="7.11" cy="7.11" r="7.11" />
        <path d="M16 16l-3.87-3.87" />
      </g>
    </svg>
  )
}

const Results = () => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const router = useRouter()
  const searchClient = algoliasearch('QFT8LZMQXO', '59e83f8d0cfafe2c0887fe8516f51fec')

  const [currentFilterModalState, setCurrentFilterModalState] = useState('')

  return (
    <>
      <InstantSearch
        searchClient={searchClient}
        indexName="SearchFront"
        routing={{
          router: history({
            onUpdate: url => router.push(url),
          }),
        }}
      >
        <Configure hitsPerPage={900} />

        {/* Partie 1 */}
        <Box className={classes.fullWidthContainer} paddingTop="82px">
          <Box className={classes.mainContainer}>
            <Box className={classes.resultHeaderContainer}>
              <Box marginBottom="40px" maxWidth="784px">
                <Typography variant="h1" color={theme.palette.secondary.contrastText}>
                  Recherche
                </Typography>
                <Typography color={theme.palette.secondary.contrastText} sx={{ fontSize: '17px' }}>
                  Recherche un pays, une ville, un lieu d’intérêt, une passion, un sport ou un
                  critère de voyage. Entre tes mots-clés et on te présente une sélection de
                  destinations et d’articles associés.
                </Typography>
              </Box>
              <Box>
                <Typography className={classes.resultsLabel}>Saisis ta recherche</Typography>
                <Box display="flex">
                  <SearchBox
                    searchAsYouType
                    classNames={{
                      root: classes.searboxRoot,
                      input: classes.searchInput,
                      submit: classes.searchSubmit,
                      reset: classes.searchReset,
                    }}
                    submitIconComponent={SubmitIcon}
                  />
                  <Button
                    variant="contained"
                    startIcon={<SearchIcon />}
                    sx={{ borderRadius: '29px' }}
                  >
                    Rechercher
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        {/* fin de partie 1 */}
        {/* Partie 2 */}

        <Search
          modalState={currentFilterModalState}
          modalStateSetter={setCurrentFilterModalState}
        />

        {/* fin de partie 2 */}
      </InstantSearch>
    </>
  )
}

export default Results
