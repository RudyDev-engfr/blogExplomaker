import { useEffect, useState } from 'react'
import Image from 'next/image'
import { makeStyles, useTheme } from '@mui/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import { useRouter } from 'next/router'
import { useMediaQuery } from '@mui/material'

import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { ArrowRightAlt } from '@mui/icons-material'

import { database } from '../lib/firebase'

import headerImg from '../images/inspirationHeaderImg.png'
import mobileHeaderImg from '../images/tom-pavlakos-NQuDiZISPtk-unsplash 1.png'
import SearchField from '../components/atoms/SearchField'
import CountryTile from '../components/atoms/CountryTile'
import ArticlesList from '../components/molecules/ArticlesList'
import SpotList from '../components/molecules/SpotList'

import blogPicture from '../images/blogCardPicture.png'
import europa from '../images/greyContinent/europa.svg'
import asia from '../images/greyContinent/asia.svg'
import africa from '../images/greyContinent/africa.svg'
import northAmerica from '../images/greyContinent/northAmerica.svg'
import centralAmerica from '../images/greyContinent/centralAmerica.svg'
import southAmerica from '../images/greyContinent/southAmerica.svg'
import middleEast from '../images/greyContinent/middleEast.svg'
import oceania from '../images/greyContinent/oceania.svg'

import europaWhite from '../images/whiteContinent/europa.svg'
import asiaWhite from '../images/whiteContinent/asia.svg'
import africaWhite from '../images/whiteContinent/africa.svg'
import northAmericaWhite from '../images/whiteContinent/northAmerica.svg'
import centralAmericaWhite from '../images/whiteContinent/centralAmerica.svg'
import southAmericaWhite from '../images/whiteContinent/southAmerica.svg'
import middleEastWhite from '../images/whiteContinent/middleEast.svg'
import oceaniaWhite from '../images/whiteContinent/oceania.svg'

import ContinentCard from '../components/atoms/ContinentCard'
import ThematicCard from '../components/atoms/ThematicCard'
import DesktopIntro from '../components/molecules/inspiration/DesktopIntro'
import MobileIntro from '../components/molecules/inspiration/MobileIntro'
import ArticlesCarousel from '../components/atoms/ArticlesCarousel'
import SpotCarousel from '../components/atoms/SpotCarousel'
import MobileSearchButton from '../components/atoms/MobileSearchButton'
import CTA from '../components/molecules/CTA'
import Head from '../components/molecules/Head'

const useStyles = makeStyles(theme => ({
  // fullWidthContainer: {
  //   backgroundColor: theme.palette.grey.e5,
  //   padding: '121px 0 80px 0',
  //   [theme.breakpoints.down('sm')]: {
  //     padding: '45px 30px 80px 30px',
  //   },
  // },
  mainContainer: {
    maxWidth: '1240px',
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      maxWidth: '100%',
    },
  },
  headerMapBox: {
    position: 'relative',
    top: '84px',
    width: '100%',
    height: '550px',
    [theme.breakpoints.down('sm')]: {
      top: '0',
      width: '100vw',
      maxWidth: '100vw',
    },
  },
  headingPaper: {
    padding: '50px 50px 30px 60px',
    position: 'relative',
    borderRadius: '40px 40px 0 0',
    [theme.breakpoints.down('sm')]: {
      padding: '40px 0px 0 30px',
    },
  },
  headerSearchbar: {
    position: 'absolute',
    top: '50%',
    right: '50%',
    transform: 'translate(50%,-100%)',
    [theme.breakpoints.down('sm')]: {
      left: 'unset',
      padding: '0 30px',
      maxWidth: '100vw',
    },
  },
  rootInput: {
    width: '441px',
    borderRadius: '50px',
    backgroundColor: '#FFFFFF',
    [theme.breakpoints.down('sm')]: {
      width: '87.5vw',
    },
  },
  headerTitle: {
    textShadow: '#000000BF 0px 2px 6px',
    fontFamily: 'Rubik',
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
      fontSize: '28px',
      fontWeight: '500',
      lineHeight: '32px',
    },
  },

  buttonPrimary: {
    padding: `${theme.spacing(2.5)} 0`,
    borderRadius: '50px',
    boxShadow: '0 3px 15px 0 #009D8C33',
    textTransform: 'none',
  },
  spotResultContainer: {
    width: '100%',
    display: 'grid',
    gridTemplate: '1fr / 1fr 1fr 1fr 1fr',
    gridGap: '30px',
  },
  continentGrid: {
    display: 'grid',
    width: '1140px',
    gridTemplate: '1fr 1fr / repeat(4, 1fr) ',
    alignItems: 'center',
    justifyItems: 'center',
    gridGap: '30px',
    [theme.breakpoints.down('sm')]: {
      gridTemplate: '1fr 1fr 1.17fr 1.17fr / repeat(2, 1fr)',
      width: 'calc(100vw - 60px)',
      gridGap: '15px',
    },
  },
  thematicGridContainer: {
    display: 'grid',
    gridTemplate: '1fr 1fr / repeat(4, 1fr)',
    gridGap: '30px',
    [theme.breakpoints.down('sm')]: {
      gridTemplate: 'repeat(4, 1fr) / repeat(2, 1fr)',
      gridGap: '15px',
      width: 'calc(100vw - 60px)',
    },
  },
  carouselNotCentered: {
    right: 'unset',
  },
  inspiTypeContainer: {
    display: 'grid',
    gridTemplate: '1fr / repeat(4, 1fr)',
    gridGap: '30px',
    [theme.breakpoints.down('sm')]: {
      gridTemplate: 'repeat(2, 1fr) / repeat(2, 1fr)',
      gridGap: '15px',
      width: 'calc(100vw - 60px)',
    },
  },
}))

export async function getStaticProps() {
  const doc = await database.ref().child(`page_structure/inspiration`).get()
  const dictionary = await database.ref().child(`dictionary`).get()
  let dataset
  let metaContinentRef
  if (doc.exists()) {
    dataset = doc.val()
  }

  if (dictionary.exists()) {
    const metaContinentRefDoc = await database.ref().child('dictionary/meta_continent').get()
    if (metaContinentRefDoc.exists()) {
      metaContinentRef = metaContinentRefDoc.val()
    }
  }

  return {
    props: { dataset, metaContinentRef },
    revalidate: 5000,
  }
}

const Inspiration = ({ dataset, metaContinentRef }) => {
  const classes = useStyles()
  const theme = useTheme()
  const router = useRouter()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const {
    spotLight: spotlight,
    monthDestination,
    favoritesArticles,
    popularThemes,
    inspirationForPeople,
    articlesCategory,
  } = dataset
  const [isShowingMoreArticles, setIsShowingMoreArticles] = useState(false)
  const [currentSpotlightArticles, setCurrentSpotlightArticles] = useState([])
  const [currentPopularThemes, setCurrentPopularThemes] = useState([])
  const [currentArticlesCategory, setCurrentArticlesCategory] = useState([])
  const [isShowingMoreSpots, setIsShowingMoreSpots] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [currentFavoritesArticles, setCurrentFavoritesArticles] = useState([])
  const [isShowingMoreFavoritesArticles, setIsShowingMoreFavoritesArticles] = useState(false)
  const [currentInspirationForPeople, setCurrentInspirationForPeople] = useState([])
  const [currentMonthInspiration, setCurrentMonthInspiration] = useState([])
  const [isShowingMoreMonthInspiration, setIsShowingMoreMonthInspiration] = useState(false)

  useEffect(() => {
    console.log('articlescategory', articlesCategory)
    if (typeof articlesCategory !== 'undefined' || articlesCategory !== {}) {
      const articlesCategoryKeys = Object.keys(articlesCategory)
      const tempArticlesCategoryArray = articlesCategoryKeys.map(
        currentKey => articlesCategory[currentKey]
      )
      setCurrentArticlesCategory(tempArticlesCategoryArray)
    }
  }, [articlesCategory])

  useEffect(() => {
    console.log('currentARticlescategory', currentArticlesCategory)
  }, [currentArticlesCategory])

  useEffect(() => {
    if (typeof monthDestination !== 'undefined' || monthDestination !== {}) {
      const monthDestinationKeys = Object.keys(monthDestination)
      const tempMonthDestinationArray = monthDestinationKeys.map(
        currentKey => monthDestination[currentKey]
      )
      setCurrentMonthInspiration(tempMonthDestinationArray)
    }
  }, [monthDestination])

  useEffect(() => {
    if (typeof favoritesArticles !== 'undefined' || favoritesArticles !== {}) {
      const favoritesArticlesKeys = Object.keys(favoritesArticles)
      const tempFavoritesArticlesArray = favoritesArticlesKeys.map(
        currentKey => favoritesArticles[currentKey]
      )
      setCurrentFavoritesArticles(tempFavoritesArticlesArray)
    }
  }, [favoritesArticles])

  useEffect(() => {
    if (typeof popularThemes !== 'undefined' || popularThemes !== {}) {
      const popularThemeKeys = Object.keys(popularThemes)
      const tempPopularThemeArray = popularThemeKeys.map(currentKey => popularThemes[currentKey])
      setCurrentPopularThemes(tempPopularThemeArray)
    }
  }, [popularThemes])

  useEffect(() => {
    if (typeof inspirationForPeople !== 'undefined' || inspirationForPeople !== {}) {
      const inspirationForPeopleKeys = Object.keys(inspirationForPeople)
      const tempInspirationForPeopleArray = inspirationForPeopleKeys.map(
        currentKey => inspirationForPeople[currentKey]
      )
      setCurrentInspirationForPeople(tempInspirationForPeopleArray)
    }
  }, [inspirationForPeople])

  const continentArray = [
    {
      name: 'Europe',
      img: europa,
      hoverImg: europaWhite,
      url: 'SearchFront%5BrefinementList%5D%5Ben_direction_de%5D%5B0%5D=Europe',
    },
    {
      name: 'Afrique',
      img: africa,
      hoverImg: africaWhite,
      url: 'SearchFront%5BrefinementList%5D%5Ben_direction_de%5D%5B0%5D=Afrique',
    },
    {
      name: 'Asie',
      img: asia,
      hoverImg: asiaWhite,
      url: 'SearchFront%5BrefinementList%5D%5Ben_direction_de%5D%5B0%5D=Asie',
    },
    {
      name: 'Océanie',
      img: oceania,
      hoverImg: oceaniaWhite,
      url: 'SearchFront%5BrefinementList%5D%5Ben_direction_de%5D%5B0%5D=Océanie',
    },
    {
      name: 'Amérique centrale',
      img: centralAmerica,
      hoverImg: centralAmericaWhite,
      url: 'SearchFront%5BrefinementList%5D%5Ben_direction_de%5D%5B0%5D=Amérique%20Centrale',
    },
    {
      name: 'Amérique du Nord',
      img: northAmerica,
      hoverImg: northAmericaWhite,
      url: 'SearchFront%5BrefinementList%5D%5Ben_direction_de%5D%5B0%5D=Amérique%20du%20Nord',
    },
    {
      name: 'Amérique du Sud',
      img: southAmerica,
      hoverImg: southAmericaWhite,
      url: 'SearchFront%5BrefinementList%5D%5Ben_direction_de%5D%5B0%5D=Amérique%20du%20Sud',
    },
    {
      name: 'Moyen-Orient',
      img: middleEast,
      hoverImg: middleEastWhite,
      url: 'SearchFront%5BrefinementList%5D%5Ben_direction_de%5D%5B0%5D=Moyen%20Orient',
    },
  ]

  useEffect(() => {
    if (typeof spotlight.linked_posts !== 'undefined') {
      const ArticlesKeys = Object.keys(spotlight.linked_posts)
      const tempArticlesArray = ArticlesKeys.map(currentKey => spotlight.linked_posts[currentKey])
      setCurrentSpotlightArticles(tempArticlesArray)
    }
  }, [spotlight])

  return (
    <>
      {dataset?.tags && <Head tags={dataset.tags} />}
      <Box>
        {matchesXs && <MobileSearchButton />}
        <Box className={classes.headerMapBox}>
          <Image
            src={!matchesXs ? headerImg : mobileHeaderImg}
            alt="header_image"
            fill
            sizes="100vw"
            style={{
              objectFit: 'cover',
            }}
          />
          <Box className={classes.headerSearchbar}>
            <Typography
              color="white"
              variant="h3"
              paddingLeft={matchesXs ? '0' : '65px'}
              className={classes.headerTitle}
            >
              Recherche ta destination voyage !
            </Typography>
            <Box display="flex" justifyContent="space-between">
              <SearchField
                placeholder="Pays, Région, Ville ..."
                className={classes.headerInspiration}
                rootInput={classes.rootInput}
                needBorder={false}
              />
            </Box>
          </Box>
        </Box>
        <Box className={classes.mainContainer} sx={{ position: 'relative', top: '-100px' }}>
          <Paper elevation={0} className={classes.headingPaper}>
            {/* Partie 1 Tile + text */}
            {matchesXs ? (
              <MobileIntro spotlight={spotlight} metaContinentRef={metaContinentRef} />
            ) : (
              <DesktopIntro spotlight={spotlight} metaContinentRef={metaContinentRef} />
            )}
            {/* fin de Partie 1 */}
            {/* Partie 2 liste de BlogCard */}
            {currentSpotlightArticles.length > 0 &&
              (!matchesXs ? (
                <Box marginBottom="30px">
                  <Typography variant="h6" color="grey.grey33" sx={{ marginBottom: '20px' }}>
                    Articles sur {spotlight.prefixed_title}
                  </Typography>
                  <ArticlesList
                    data={currentSpotlightArticles}
                    isShowingMoreArticles={isShowingMoreArticles}
                    numberOfArticles={3}
                    numberOfMaxArticles={9}
                  />
                  <Box display="flex" justifyContent="center" sx={{ paddingTop: '20px' }}>
                    {currentSpotlightArticles.length > 3 &&
                      (!isShowingMoreArticles ? (
                        <Button
                          variant="contained"
                          className={classes.buttonPrimary}
                          onClick={() => setIsShowingMoreArticles(true)}
                          sx={{ width: '13%', minWidth: '150px' }}
                        >
                          Voir tout
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          className={classes.buttonPrimary}
                          onClick={() => setIsShowingMoreArticles(false)}
                          sx={{ minWidth: '150px', width: '13%' }}
                        >
                          Voir moins
                        </Button>
                      ))}
                  </Box>
                </Box>
              ) : (
                <Box marginBottom="120px">
                  <Box marginBottom="20px">
                    <Typography
                      variant="h6"
                      color="grey.grey33"
                      textAlign="center"
                      paddingRight="30px"
                    >
                      Articles sur {spotlight.prefixed_title}
                    </Typography>
                  </Box>
                  <Box sx={{ position: 'relative', maxWidth: '100vw' }}>
                    <ArticlesCarousel
                      currentArticles={currentSpotlightArticles}
                      // dotListClass={classes.carouselNotCentered}
                    />
                  </Box>
                </Box>
              ))}
            {/* fin de Partie 2 */}
            {/* Partie 3 liste de spots */}
            {!matchesXs ? (
              <Box>
                <Typography variant="h6" color="grey.grey33" marginBottom="20px">
                  Spots en {spotlight.title}
                </Typography>
                <Box className={classes.spotResultContainer}>
                  <SpotList data={spotlight.unmissable} isShowingMoreSpots={isShowingMoreSpots} />
                </Box>
                <Box display="flex" justifyContent="center" sx={{ paddingTop: '20px' }}>
                  {!isShowingMoreSpots ? (
                    <Button
                      variant="contained"
                      className={classes.buttonPrimary}
                      onClick={() => setIsShowingMoreSpots(true)}
                      sx={{ width: '13%' }}
                    >
                      Voir tout
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      className={classes.buttonPrimary}
                      onClick={() => setIsShowingMoreSpots(false)}
                      sx={{ width: '13%' }}
                    >
                      Voir moins
                    </Button>
                  )}
                </Box>
              </Box>
            ) : (
              <Box marginBottom="30px">
                <Box>
                  <Typography
                    variant="h6"
                    color="grey.grey33"
                    marginBottom="15px"
                    textAlign="center"
                    paddingRight="30px"
                  >
                    Spots en {spotlight.title}
                  </Typography>
                </Box>
                <Box sx={{ position: 'relative' }}>
                  <SpotCarousel
                    currentSpots={spotlight.unmissable}
                    isShowingMoreSpots={isShowingMoreSpots}
                    // dotListClass={classes.carouselNotCentered}
                  />
                </Box>
              </Box>
            )}
          </Paper>
        </Box>
        {/* Fin de partie 3 */}
        {/* Partie 4 liste de continents */}
        <Box
          sx={{
            backgroundColor: theme.palette.grey.f7,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: matchesXs ? '60px 30px' : '30px',
          }}
        >
          <Box>
            <Typography
              variant="h6"
              color="primary.ultraDark"
              fontWeight="400"
              sx={{ marginBottom: '10px' }}
            >
              Thématiques
            </Typography>
            <Typography variant="h3" sx={{ fontFamily: 'rubik', marginBottom: '30px' }}>
              Inspiration par continent
            </Typography>
            <Box className={classes.continentGrid}>
              {continentArray.map(({ name, img, hoverImg, url }, index) => (
                <ContinentCard
                  continentTitle={name}
                  continentImg={img}
                  continentHoverImg={hoverImg}
                  setIsHovering={setIsHovering}
                  isHovering={isHovering}
                  index={index}
                  key={name}
                  url={url}
                  isOversized={matchesXs && index > 3}
                />
              ))}
            </Box>
          </Box>
        </Box>
        {/* fin de Partie 4 liste de continents */}
        {/* Partie 5 liste des thématiques */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.palette.grey.f7,
          }}
        >
          <Box
            sx={{ width: !matchesXs ? '1140px' : '100vw', padding: matchesXs ? '30px' : '60px 0' }}
          >
            <Typography
              variant="h6"
              color="primary.ultraDark"
              fontWeight="400"
              sx={{ marginBottom: '10px' }}
            >
              Thématiques
            </Typography>
            <Typography variant="h3" sx={{ fontFamily: 'rubik', marginBottom: '30px' }}>
              Thématiques les plus populaires
            </Typography>
            <Box className={classes.thematicGridContainer}>
              {currentPopularThemes.map(({ name: thematicName, picture, target_url: link }) => (
                <ThematicCard
                  key={thematicName}
                  title={thematicName}
                  srcImg={picture.src.original}
                  link={link}
                />
              ))}
            </Box>
          </Box>
        </Box>
        {/* Fin de partie 5 */}
        {/* Partie 6 */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '60px',
            marginBottom: '60px',
          }}
        >
          <Box
            sx={{
              width: !matchesXs ? '1140px' : '100vw',
              padding: matchesXs && '0 0 0 30px',
            }}
          >
            <Typography
              variant="h6"
              color="primary.ultraDark"
              fontWeight="400"
              sx={{ marginBottom: '10px' }}
            >
              Articles
            </Typography>
            <Typography variant="h3" sx={{ fontFamily: 'rubik', marginBottom: '30px' }}>
              Vos articles préférés de la semaine
            </Typography>
            {matchesXs ? (
              <Box sx={{ position: 'relative', maxWidth: '100vw', marginBottom: '50px' }}>
                <ArticlesCarousel
                  currentArticles={currentFavoritesArticles}
                  // dotListClass={classes.carouselNotCentered}
                />
              </Box>
            ) : (
              <>
                <ArticlesList
                  data={currentFavoritesArticles}
                  isShowingMoreArticles={isShowingMoreFavoritesArticles}
                  isSmallSize
                  numberOfArticles={3}
                  numberOfMaxArticles={9}
                />{' '}
                <Box display="flex" justifyContent="center" sx={{ paddingTop: '15px' }}>
                  {currentFavoritesArticles.length > 3 &&
                    (!isShowingMoreFavoritesArticles ? (
                      <Button
                        variant="contained"
                        className={classes.buttonPrimary}
                        onClick={() => setIsShowingMoreFavoritesArticles(true)}
                        sx={{ width: '13%', minWidth: '150px' }}
                      >
                        Voir tout
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        className={classes.buttonPrimary}
                        onClick={() => setIsShowingMoreFavoritesArticles(false)}
                        sx={{ width: '13%', minWidth: '150px' }}
                      >
                        Voir moins
                      </Button>
                    ))}
                </Box>
              </>
            )}
          </Box>
        </Box>
        {/* Fin de la partie 6 */}
        {/* Partie 7 */}
        {/* <Box
          sx={{
            width: !matchesXs ? '1140px' : '100vw',
            padding: matchesXs && '30px',
            margin: 'auto',
            marginBottom: '60px',
            paddingTop: '60px',
          }}
        >
          <Typography variant="h3" sx={{ fontFamily: 'rubik', marginBottom: '30px' }}>
            Articles par catégorie
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            {currentArticlesCategory.map(currentCategory => (
              <Button
                endIcon={<ArrowRightAlt />}
                sx={{
                  width: '360px',
                  backgroundColor: theme.palette.grey.f7,
                  textTransform: 'none',
                  justifyContent: 'space-between',
                  padding: '15px 20px',
                  color: theme.palette.grey.grey33,
                  marginBottom: '20px',
                  '@media (min-width: 600px) and (max-width: 960px)': {},
                }}
                onClick={() =>
                  router.push(`
            /exploration?SearchFront%5BrefinementList%5D%5Btype_d_article%5D%5B0%5D=${encodeURI(
              currentCategory.target_url
            )}`)
                }
              >
                {currentCategory.name}
              </Button>
            ))}
          </Box>
        </Box> */}
        {/* fin de la Partie 7 */}
        {/* partie 8 */}
        <Box sx={{ backgroundColor: theme.palette.grey.f7, margin: 'auto' }}>
          <Box
            sx={{
              width: !matchesXs ? '1140px' : '100vw',
              padding: matchesXs && '30px',
              margin: 'auto',
              paddingTop: '60px',
              paddingBottom: '60px',
            }}
          >
            <Typography
              variant="h6"
              color="primary.ultraDark"
              fontWeight="400"
              sx={{ marginBottom: '10px' }}
            >
              Thématiques
            </Typography>
            <Typography variant="h3" sx={{ fontFamily: 'rubik', marginBottom: '30px' }}>
              De l&apos;inspi pour tous tes projets de voyage
            </Typography>
            <Box className={classes.inspiTypeContainer}>
              {currentInspirationForPeople.map(
                ({ logo, name: inspirationName, picture, target_url: targetUrl }) => (
                  <ThematicCard
                    key={inspirationName}
                    title={inspirationName}
                    srcImg={picture.src.original}
                    link={targetUrl}
                  />
                )
              )}
            </Box>
          </Box>
        </Box>
        {/* fin de la partie 8 */}
        {/* Partie 9 inspiration par mois */}
        <Box
          sx={{
            width: !matchesXs ? '1140px' : '100vw',
            padding: matchesXs && '0  0 0 30px',
            margin: 'auto',
            paddingTop: '60px',
            marginBottom: matchesXs ? '180px' : '60px',
          }}
        >
          <Typography
            variant="h6"
            color="primary.ultraDark"
            fontWeight="400"
            sx={{ marginBottom: '10px' }}
          >
            Articles
          </Typography>
          <Typography variant="h3" sx={{ fontFamily: 'rubik', marginBottom: '30px' }}>
            Les meilleures destinations, mois par mois
          </Typography>
          {matchesXs ? (
            <Box sx={{ position: 'relative', maxWidth: '100vw' }}>
              <ArticlesCarousel
                currentArticles={currentMonthInspiration}
                // dotListClass={classes.carouselNotCentered}
              />
            </Box>
          ) : (
            <>
              <ArticlesList
                data={currentMonthInspiration}
                isShowingMoreArticles={isShowingMoreMonthInspiration}
                isSmallSize
                numberOfArticles={6}
                numberOfMaxArticles={12}
              />
              <Box display="flex" justifyContent="center" sx={{ paddingTop: '60px' }}>
                {!isShowingMoreMonthInspiration ? (
                  <Button
                    variant="contained"
                    className={classes.buttonPrimary}
                    onClick={() => setIsShowingMoreMonthInspiration(true)}
                    sx={{ width: '13%' }}
                  >
                    Voir tout
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    className={classes.buttonPrimary}
                    onClick={() => setIsShowingMoreMonthInspiration(false)}
                    sx={{ width: '13%' }}
                  >
                    Voir moins
                  </Button>
                )}
              </Box>
            </>
          )}
        </Box>
        {/* fin de partie 9 */}
        <Box
          sx={{
            width: !matchesXs ? '1140px' : '100vw',
            padding: matchesXs && '0  30px 0 30px',
            margin: 'auto',
            paddingTop: '60px',
            marginBottom: matchesXs ? '180px' : '60px',
          }}
        >
          <CTA imageDisplayed={!matchesXs} />
        </Box>
      </Box>
    </>
  )
}
export default Inspiration
