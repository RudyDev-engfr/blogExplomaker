import { useState, useEffect, useContext, useCallback } from 'react'

import { useHits } from 'react-instantsearch-hooks-web'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/styles'
import Typography from '@mui/material/Typography'
import makeStyles from '@mui/styles/makeStyles'
import Image from 'next/image'

import { SessionContext } from '../../contexts/session'
import { database } from '../../lib/firebase'
import SearchFilter from './SearchFilter'

import union from '../../images/icons/Union.svg'
import SpotList from './SpotList'
import ArticlesList from './ArticlesList'

const useStyles = makeStyles(theme => ({
  greyBackgroundContainer: {
    backgroundColor: theme.palette.grey.e5,
  },
  mainContainer: {
    maxWidth: '1140px',
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100vw',
      margin: '0',
      position: 'relative',
      top: '-50px',
    },
  },
  spotResultContainer: {
    width: '100%',
    display: 'grid',
    gridTemplate: '1fr / 1fr 1fr 1fr 1fr',
    gridGap: '30px',
    paddingBottom: '60px',
  },
  articlesResultContainer: {
    paddingBottom: '80px',
  },
  filterButton: {
    textTransform: 'none',
    color: theme.palette.grey.grey33,
    border: '1px solid #DFDFDF',
    borderRadius: '5px',
    backgroundColor: theme.palette.secondary.contrastText,
    '&::before': {
      '&:hover': {
        backgroundColor: theme.palette.secondary.contrastText,
      },
    },
    '&:hover': {
      backgroundColor: theme.palette.secondary.contrastText,
    },
  },
  // sortAdornment: {
  //   fontSize: '14px',
  // },
  // inputSort: {
  //   fontSize: '14px',
  // },
}))

const Search = ({ modalState, modalStateSetter }) => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  const { setCurrentHitsArray } = useContext(SessionContext)
  const [currentSpots, setCurrentSpots] = useState([])
  const [currentArticles, setCurrentArticles] = useState([])
  const [isShowingAllSpots, setIsShowingAllSpots] = useState(false)
  const [isShowingAllArticles, setIsShowingAllArticles] = useState(false)

  // const [currentSort, setCurrentSort] = useState('pertinence')

  const transformItems = useCallback(
    spotsAndArticles =>
      spotsAndArticles.map(spotOrArticle => ({
        ...spotOrArticle,
      })),
    []
  )
  const { hits } = useHits({ transformItems })
  // console.log('hits', hits)
  // console.log(typeof hits)
  useEffect(() => {
    const hitsKeys = Object.keys(hits)
    const hitsArray = hitsKeys.map(key => hits[key])
    if (typeof hitsArray !== 'undefined') {
      setCurrentSpots(hitsArray.filter(hit => hit.resultats === 'Destinations'))
      setCurrentArticles(hitsArray.filter(hit => hit.resultats === 'Articles'))
      setCurrentHitsArray(hitsArray)
    }
  }, [hits])

  return (
    <>
      <Box className={classes.greyBackgroundContainer} paddingTop="35px">
        <Box className={classes.mainContainer}>
          <Box>
            <Box marginBottom="20px" display="flex" justifyContent="space-between" width="100%">
              <Typography variant="h1" component="h2">
                Résultats
              </Typography>
              <Box display="flex">
                {/* <TextField
                  mr={2}
                  type="select"
                  select
                  SelectProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography className={classes.sortAdornment}>Trié par :</Typography>
                      </InputAdornment>
                    ),
                  }}
                  value={currentSort}
                  InputProps={{
                    classes: {
                      input: classes.inputSort,
                    },
                  }}
                  aria-label="Trié par:"
                  hiddenLabel
                  variant="outlined"
                  onChange={event => setCurrentSort(event.target.value)}
                  disableRipple
                  classes={{ root: classes.filterButton }}
                  sx={{ width: '185px', fontSize: '14px' }}
                >
                  <MenuItem value="pertinence" sx={{ fontSize: '14px' }}>
                    Pertinence
                  </MenuItem>
                  <MenuItem value="oldest" sx={{ fontSize: '14px' }}>
                    Du plus ancien
                  </MenuItem>
                  <MenuItem value="newest" sx={{ fontSize: '14px' }}>
                    Du plus récent
                  </MenuItem>
                </TextField> */}
                <Button
                  startIcon={<Image src={union} width={20} height={20} quality={100} />}
                  onClick={() => modalStateSetter('filter')}
                  disableRipple
                  classes={{ root: classes.filterButton }}
                >
                  Filtrer
                </Button>
              </Box>
            </Box>
            <Box
              marginBottom="30px"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              {currentSpots.length > 0 && (
                <Typography variant="h3" component="h2">
                  Spots({currentSpots.length})
                </Typography>
              )}
              {currentSpots.length > 4 && (
                <Button
                  sx={{ textTransform: 'none' }}
                  variant="contained"
                  onClick={() => setIsShowingAllSpots(true)}
                >
                  Voir tout
                </Button>
              )}
            </Box>
            <Box className={classes.spotResultContainer}>
              {currentSpots.length > 0 && (
                <SpotList data={currentSpots} isShowingAllSpots={isShowingAllSpots} isAlgolia />
              )}
            </Box>
            <Box
              marginBottom="30px"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              {currentArticles.length > 0 && (
                <Typography variant="h3" component="h2">
                  Articles({currentArticles.length})
                </Typography>
              )}
              {currentArticles.length > 9 && (
                <Button
                  sx={{ textTransform: 'none' }}
                  variant="contained"
                  onClick={() => setIsShowingAllArticles(true)}
                >
                  Voir tout
                </Button>
              )}
            </Box>
            <Box className={classes.articlesResultContainer}>
              {currentArticles.length > 0 && (
                <ArticlesList
                  data={currentArticles}
                  isShowingAllArticles={isShowingAllArticles}
                  isAlgolia
                  numberOfArticles={3}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      <SearchFilter
        modalState={modalState}
        modalStateSetter={modalStateSetter}
        currentArticles={currentArticles}
      />
    </>
  )
}

export default Search
