import { useState, useEffect, useContext, useRef } from 'react'
import { useRouter } from 'next/router'

import algoliasearch from 'algoliasearch'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import useMediaQuery from '@mui/material/useMediaQuery'
import { IconButton, useTheme } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import SearchIcon from '@mui/icons-material/Search'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'

import { Configure, InstantSearch, SearchBox } from 'react-instantsearch-hooks-web'
import { history } from 'instantsearch.js/es/lib/routers'

import Search from '../components/molecules/Search'
import GoTopBtn from '../components/GoTopBtn'

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
    position: 'relative',
  },
  searchInput: {
    minWidth: '400px',
    minHeight: '45px',
    borderRadius: '50px',
    border: 'none',
    padding: '15px',
    paddingLeft: '40px',
    fontSize: '17px',
    [theme.breakpoints.down('sm')]: {
      minWidth: '80vw',
      backgroundColor: theme.palette.grey.f2,
      // minWidth: 'unset',
    },
  },
  searchSubmit: {
    // display: 'none',
    position: 'absolute',
    left: '15px',
    top: '13px',
    backgroundColor: theme.palette.secondary.contrastText,
    border: 'none',
    color: theme.palette.primary.main,
    [theme.breakpoints.down('sm')]: {
      backgroundColor: theme.palette.grey.f2,
      width: '20px',
      height: '20px',
    },
  },
  searchReset: {
    display: 'none',
  },
  buttonBack: {
    padding: '0',
  },
  loadingIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '6px',
  },
}))

const Results = () => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const router = useRouter()
  const searchClient = algoliasearch('QFT8LZMQXO', '59e83f8d0cfafe2c0887fe8516f51fec')

  const [currentFilterModalState, setCurrentFilterModalState] = useState('')
  const [showGoTop, setShowGoTop] = useState(false)
  const refScrollUp = useRef(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleVisibleButton = () => {
    if (window.pageYOffset > 50) {
      setShowGoTop(true)
    } else {
      setShowGoTop(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleVisibleButton)

    return () => {
      window.removeEventListener('scroll', handleVisibleButton)
    }
  }, [handleVisibleButton])

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
        <Box ref={refScrollUp} />
        {!matchesXs && (
          <GoTopBtn
            show={showGoTop}
            scrollUp={() =>
              refScrollUp.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'start',
              })
            }
          />
        )}
        {/* Partie 1 */}
        {!matchesXs ? (
          <Box className={classes.fullWidthContainer} paddingTop="82px">
            <Box className={classes.mainContainer}>
              <Box className={classes.resultHeaderContainer}>
                <Box marginBottom="40px" maxWidth="784px">
                  <Typography variant="h1" color={theme.palette.secondary.contrastText}>
                    Recherche
                  </Typography>
                  <Typography
                    color={theme.palette.secondary.contrastText}
                    sx={{ fontSize: '17px' }}
                  >
                    Recherche un pays, une ville, un lieu d’intérêt, une passion, un sport ou un
                    critère de voyage. Entre tes mots-clés et on te présente une sélection de
                    destinations et d’articles associés.
                  </Typography>
                </Box>
                <Box>
                  <Typography className={classes.resultsLabel}>Saisis ta recherche</Typography>
                  <Box display="flex" justifyContent="flex-start">
                    <SearchBox
                      searchAsYouType
                      classNames={{
                        root: classes.searboxRoot,
                        input: classes.searchInput,
                        submit: classes.searchSubmit,
                        reset: classes.searchReset,
                      }}
                      submitIconComponent={() => <SearchIcon />}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            display="flex"
            sx={{
              position: 'fixed',
              backgroundColor: theme.palette.secondary.contrastText,
              width: '100vw',
              padding: '45px 24px 0px',
              zIndex: 900,
            }}
          >
            <IconButton
              disableElevation
              disableRipple
              className={classes.buttonBack}
              onClick={() => router.back()}
            >
              <ArrowBackIosIcon />
            </IconButton>
            <SearchBox
              searchAsYouType
              classNames={{
                root: classes.searboxRoot,
                input: classes.searchInput,
                submit: classes.searchSubmit,
                reset: classes.searchReset,
                loadingIcon: classes.loadingIcon,
              }}
              submitIconComponent={() => <SearchIcon />}
            />
          </Box>
        )}
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
