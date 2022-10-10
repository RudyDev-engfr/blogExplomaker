import { useState, useEffect, useContext } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import makeStyles from '@mui/styles/makeStyles'
import Image from 'next/image'

import { SessionContext } from '../../contexts/session'
import { database } from '../../lib/firebase'
import CountryTile from '../atoms/CountryTile'
import MobileBlogCard from './MobileBlogCard'
import SearchFilter from './SearchFilter'

import union from '../../images/icons/Union.svg'

const fnURL =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5001/explomaker-3010b/us-central1/returnSearch'
    : 'https://us-central1-explomaker-3010b.cloudfunctions.net/returnSearch'

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
  mobileBlogCardAndCountryTile: {
    margin: '30px 0 30px 0',
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
  sortAdornment: {
    fontSize: '14px',
  },
  inputSort: {
    fontSize: '14px',
  },
}))

const SpotsSearch = ({ data, isShowingAllSpots }) => {
  const classes = useStyles()

  return (
    <>
      {data
        .filter((spot, index) => (isShowingAllSpots ? true : index <= 3))
        .map(({ gps, picture_main: pictureMain, title, slug, color }) => (
          <CountryTile
            countryTitle={title}
            category={gps.country}
            srcImg={pictureMain.src.original}
            categoryColor={color}
            altImg=""
            key={`spot/${slug}`}
            link={slug}
            className={classes.mobileBlogCardAndCountryTile}
          />
        ))}
    </>
  )
}

const ArticlesSearch = ({ data, isShowingAllArticles }) => {
  const classes = useStyles()

  return (
    <Box display="flex" justifyContent="space-between" flexWrap="wrap">
      {data
        .filter((article, index) => (isShowingAllArticles ? true : index <= 8))
        .map(({ title, picture_1: pictureMain, target_url: targetUrl }) => (
          <MobileBlogCard
            srcImg={pictureMain}
            link={targetUrl}
            title={title}
            key={targetUrl}
            commentsCount={Math.floor(Math.random() * 100)}
            likesCount={Math.floor(Math.random() * 100)}
            publishDate="17 Déc 2020 | 6min"
            isResult
            className={classes.mobileBlogCardAndCountryTile}
          />
        ))}
    </Box>
  )
}

const Search = ({ modalState, modalStateSetter }) => {
  const classes = useStyles()

  const { searchValue, setNeedFetch, needFetch } = useContext(SessionContext)

  const [currentSpots, setCurrentSpots] = useState([])
  const [isSpotsShowing, setIsSpotsShowing] = useState(true)
  const [currentArticles, setCurrentArticles] = useState([])
  const [isArticlesShowing, setIsArticlesShowing] = useState(true)
  const [enviesSport, setEnviesSport] = useState([])
  const [isShowingAllSpots, setIsShowingAllSpots] = useState(false)
  const [isShowingAllArticles, setIsShowingAllArticles] = useState(false)
  const [currentSort, setCurrentSort] = useState('pertinence')

  const getDictionnary = () => {
    database
      .ref()
      .child('dictionary/meta_name_envies_sport')
      .get()
      .then(async snapshot => {
        if (snapshot.exists()) {
          let tempEnviesSport = snapshot.val()
          const arrayOfEnviesSport = Object.entries(tempEnviesSport)
          tempEnviesSport = arrayOfEnviesSport.map(like => ({
            value: like[0],
            label: like[1].name,
            icon: like[1].logo,
          }))
          setEnviesSport(tempEnviesSport)
        }
      })
  }

  useEffect(() => {
    getDictionnary()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (searchValue.length > 2 && needFetch) {
      const myHeaders = new Headers({
        'Content-Type': 'application/json',
      })

      const myInit = {
        method: 'POST',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default',
        body: JSON.stringify({ value: searchValue }),
      }
      fetch(fnURL, myInit)
        .then(async response => {
          const payload = await response.json()
          setNeedFetch(false)
          setCurrentArticles(payload.articles)
          setCurrentSpots(payload.spots)
          console.log(payload)
        })
        .catch(error => console.error(error))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needFetch])

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
                <TextField
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
                </TextField>
                <Button
                  startIcon={<Image src={union} width={20} height={20} quality={100} />}
                  onClick={() => modalStateSetter('login')}
                  disableRipple
                  classes={{ root: classes.filterButton }}
                >
                  Filtrer
                </Button>
              </Box>
            </Box>
            {/* <Box className={classes.filterContainer}>          </Box> */}
            {isSpotsShowing && (
              <>
                <Box
                  marginBottom="30px"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h3" component="h2">
                    Spots({currentSpots.length})
                  </Typography>
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
                    <SpotsSearch data={currentSpots} isShowingAllSpots={isShowingAllSpots} />
                  )}
                </Box>
              </>
            )}
            {isArticlesShowing && (
              <>
                <Box
                  marginBottom="30px"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h3" component="h2">
                    Articles({currentArticles.length})
                  </Typography>
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
                    <ArticlesSearch
                      data={currentArticles}
                      isShowingAllArticles={isShowingAllArticles}
                    />
                  )}
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>
      <SearchFilter
        modalState={modalState}
        modalStateSetter={modalStateSetter}
        setIsSpotsShowing={setIsSpotsShowing}
        setIsArticlesShowing={setIsArticlesShowing}
        isSpotsShowing={isSpotsShowing}
        isArticlesShowing={isArticlesShowing}
        enviesSport={enviesSport}
        currentArticles={currentArticles}
      />
    </>
  )
}

export default Search
