import { useState, useEffect, useContext } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { useRouter } from 'next/router'

import SearchField from '../../components/atoms/SearchField'
import Search from '../../components/molecules/Search'
import { SessionContext } from '../../contexts/session'

const useStyles = makeStyles(theme => ({
  mainContainer: {
    padding: '60px 0',
    backgroundColor: theme.palette.primary.ultraDark,
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
}))

const Results = () => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const router = useRouter()
  const { search } = router.query

  const { setSearchValue, needFetch, setNeedFetch } = useContext(SessionContext)

  const [isShowingResults, setIsShowingResults] = useState(false)
  const [currentFilterModalState, setCurrentFilterModalState] = useState('')

  useEffect(() => {
    if (typeof search !== 'undefined' && search !== '') {
      setSearchValue(search)
      setNeedFetch(true)
      setIsShowingResults(true)
    }
  }, [search])

  return (
    <>
      {/* Partie 1 */}
      <Box
        className={classes.fullWidthContainer}
        paddingTop="82px"
        backgroundColor={theme.palette.grey.e5}
      >
        <Box className={classes.mainContainer}>
          <Box className={classes.resultHeaderContainer}>
            <Box marginBottom="40px">
              <Typography variant="h1" color={theme.palette.secondary.contrastText}>
                Recherche
              </Typography>
              <Typography color={theme.palette.secondary.contrastText} sx={{ fontSize: '17px' }}>
                Recherche un pays, une ville, un lieu d’intérêt, une passion, un sport ou un critère
                de voyage. Entre tes mots-clés et on te présente une sélection de destinations et
                d’articles associés.
              </Typography>
            </Box>
            <Box>
              <Typography className={classes.resultsLabel}>Saisis ta recherche</Typography>
              <SearchField />
            </Box>
          </Box>
        </Box>
      </Box>
      {/* fin de partie 1 */}
      {/* Partie 2 */}

      {isShowingResults && (
        <Search
          modalState={currentFilterModalState}
          modalStateSetter={setCurrentFilterModalState}
        />
      )}

      {/* fin de partie 2 */}
    </>
  )
}

export default Results
