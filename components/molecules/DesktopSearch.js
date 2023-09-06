import { useContext, useState } from 'react'
import { makeStyles, useTheme } from '@mui/styles'
import { Badge, useMediaQuery } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import Image from 'next/image'

import SearchFilter from './SearchFilter'
import union from '../../images/icons/filtre.svg'
import SpotList from './SpotList'
import ArticlesList from './ArticlesList'
import { SessionContext } from '../../contexts/session'
import DesktopAccordionFilter from './DesktopAccordionFilter'

const useStyles = makeStyles(theme => ({
  greyBackgroundContainer: {
    backgroundColor: theme.palette.grey.f7,
  },
  mainContainer: {
    maxWidth: '1140px',
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '90vw',
      margin: 'auto',
      position: 'relative',
      top: '145px',
    },
  },
  spotResultContainer: {
    width: '100%',
    display: 'grid',
    gridTemplate: '1fr / 1fr 1fr 1fr 1fr',
    gridGap: '30px',
    paddingBottom: '60px',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '90vw',
    },
  },
  articlesResultContainer: {
    paddingBottom: '80px',
  },
  filterButton: {
    textTransform: 'none',
    color: theme.palette.grey.grey33,
    border: '1px solid #DFDFDF',
    borderRadius: '5px',
    fontSize: '14px',
    padding: '6px 13px',
    height: '32px',
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

const DesktopSearch = ({
  modalStateSetter,
  modalState,
  currentSpots,
  currentArticles,
  setIsShowingMoreSpots,
  isShowingMoreSpots,
  isShowingMoreArticles,
  setIsShowingMoreArticles,
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const [expanded, setExpanded] = useState([])
  const { currentHitsArray, currentRefinementsArrayLength, setCurrentRefinementsArrayLength } =
    useContext(SessionContext)

  const currentFilters = [
    {
      header: 'Type de séjours',
      category: 'type_de_sejour',
    },
    {
      header: "Type d'article",
      category: 'type_d_article',
    },
    { header: 'Envies', category: 'envies' },
    { header: 'Tags Article', category: 'tags_articles' },
    { header: 'Tu es un voyageur', category: 'tu_es_un_voyageur' },
    { header: 'Durée du séjour', category: 'duree_du_sejour' },
    { header: 'En direction de', category: 'en_direction_de' },
    { header: 'Avis explomaker', category: 'avis_explomaker' },
    {
      header: 'Type de résultats',
      category: 'resultats',
    },
    {
      header: 'Période de visite',
      category: 'periode',
    },
  ]

  return (
    <>
      <Box className={classes.greyBackgroundContainer} paddingTop="115px">
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
                {/* <Badge color="primary" badgeContent={currentRefinementsArrayLength}>
                  <Button
                    startIcon={
                      <Image
                        src={union}
                        width={13.33}
                        height={13.33}
                        quality={100}
                        alt="filter_icon"
                        style={{
                          maxWidth: '100%',
                          height: 'auto',
                        }}
                      />
                    }
                    onClick={() => modalStateSetter('filter')}
                    disableRipple
                    classes={{ root: classes.filterButton }}
                  >
                    Filtrer
                  </Button>
                </Badge> */}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gridGap: '15px' }}>
              {currentFilters.map(({ header, category }, index) => (
                <DesktopAccordionFilter
                  isFirstAccordion={false}
                  header={header}
                  category={category}
                  key={category}
                  index={index}
                  expanded={expanded}
                  setExpanded={setExpanded}
                />
              ))}
            </Box>
            <Box
              marginBottom="30px"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ paddingTop: '15px' }}
            >
              {currentSpots.length > 0 && (
                <Typography variant="h3" component="h2">
                  Spots({currentSpots.length > 16 ? '16+' : currentSpots.length})
                </Typography>
              )}
            </Box>
            {!matchesXs && currentSpots.length > 0 && (
              <>
                <Box className={classes.spotResultContainer}>
                  <SpotList
                    data={currentSpots}
                    isShowingMoreSpots={isShowingMoreSpots}
                    isAlgolia
                    numberOfSpots={8}
                  />
                </Box>
                {currentSpots.length > 4 && !isShowingMoreSpots && (
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      paddingBottom: '15px',
                    }}
                  >
                    <Button
                      sx={{
                        textTransform: 'none',
                        height: '32px',
                        borderRadius: '5px',
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                      variant="contained"
                      onClick={() => setIsShowingMoreSpots(true)}
                    >
                      Voir plus
                    </Button>
                  </Box>
                )}
                {isShowingMoreSpots && (
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      paddingBottom: '15px',
                    }}
                  >
                    <Button
                      sx={{
                        textTransform: 'none',
                        height: '32px',
                        borderRadius: '5px',
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                      variant="contained"
                      onClick={() => setIsShowingMoreSpots(false)}
                    >
                      Voir moins
                    </Button>
                  </Box>
                )}
              </>
            )}
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
            </Box>
            <Box className={classes.articlesResultContainer}>
              {currentArticles.length > 0 && (
                <ArticlesList
                  data={currentArticles}
                  isShowingMoreArticles={isShowingMoreArticles}
                  isAlgolia
                  numberOfArticles={9}
                  numberOfMaxArticles={29}
                />
              )}
            </Box>
            {currentArticles.length > 9 && !isShowingMoreArticles && (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  paddingBottom: '15px',
                }}
              >
                <Button
                  sx={{
                    textTransform: 'none',
                    height: '32px',
                    borderRadius: '5px',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                  variant="contained"
                  onClick={() => setIsShowingMoreArticles(true)}
                >
                  Voir plus
                </Button>
              </Box>
            )}
            {isShowingMoreArticles && (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  paddingBottom: '15px',
                }}
              >
                <Button
                  sx={{
                    textTransform: 'none',
                    height: '32px',
                    borderRadius: '5px',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                  variant="contained"
                  onClick={() => setIsShowingMoreArticles(false)}
                >
                  Voir moins
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <SearchFilter modalState={modalState} modalStateSetter={modalStateSetter} />
    </>
  )
}

export default DesktopSearch
