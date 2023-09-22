import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import useMediaQuery from '@mui/material/useMediaQuery'
import { FormControl, FormLabel, useTheme } from '@mui/material'
import ButtonBase from '@mui/material/ButtonBase'
import makeStyles from '@mui/styles/makeStyles'
import Add from '@mui/icons-material/Add'
import ArrowRightAlt from '@mui/icons-material/ArrowRightAlt'
import ChatBubble from '@mui/icons-material/ChatBubble'
import Check from '@mui/icons-material/Check'
import DirectionsBus from '@mui/icons-material/DirectionsBus'
import EmojiObjects from '@mui/icons-material/EmojiObjects'
import EventNote from '@mui/icons-material/EventNote'
import Explore from '@mui/icons-material/Explore'
import Favorite from '@mui/icons-material/Favorite'
import Flight from '@mui/icons-material/Flight'
import HomeIcon from '@mui/icons-material/Home'
import Poll from '@mui/icons-material/Poll'
import RestaurantMenu from '@mui/icons-material/RestaurantMenu'
import clsx from 'clsx'
import Carousel from 'react-material-ui-carousel'
import 'react-multi-carousel/lib/styles.css'
import ReactPlayer from 'react-player/lazy'

import BlogCard from '../components/molecules/BlogCard'
import SpotCard from '../components/SpotCard'
import { database, mailCollection } from '../lib/firebase'
import GoTopBtn from '../components/GoTopBtn'
import TrendingDestinations from '../components/molecules/TrendingDestinations'
import Head from '../components/molecules/Head'

import logoFull from '../images/icons/logoFull.svg'
import illustrationComplete from '../images/ILLUSTRATION_COMPLETE.png'
import illustrationPlanning from '../images/ILLUSTRATION_PLANNING_1.png'
import illustrationCollab from '../images/ILLUSTRATION_COLLAB.png'
import logo from '../images/icons/logo.svg'
import MobileBlogCard from '../components/molecules/MobileBlogCard'
import MobileSearchButton from '../components/atoms/MobileSearchButton'
import ThematicCard from '../components/atoms/ThematicCard'

const tiles = [
  { Icon: HomeIcon, label: 'Logement' },
  { Icon: Explore, label: 'Activité' },
  { Icon: RestaurantMenu, label: 'Restaurant' },
  { Icon: DirectionsBus, label: 'Transports' },
  { Icon: Flight, label: 'Vols A/R' },
]

const itemsPreparation = [
  {
    Icon: EventNote,
    label: 'Planning',
  },
  {
    Icon: Explore,
    label: 'Exploration',
  },
  {
    Icon: EmojiObjects,
    label: 'Inspiration',
  },
]

const useStyles = makeStyles(theme => ({
  headerTitle: {
    '& span': {
      color: theme.palette.primary.main,
    },
  },
  fullWidthContainer: {
    borderBottom: `140px solid ${theme.palette.primary.ultraDark}`,
    [theme.breakpoints.down('sm')]: {
      borderBottom: '0',
    },
  },
  greenBackgroundContainer: {
    paddingTop: '1px',
    backgroundColor: '#F4FBFA',
  },
  whiteBackgroundContainer: {
    backgroundColor: theme.palette.secondary.contrastText,
  },
  greyBackgroundContainer: {
    backgroundColor: theme.palette.grey.f7,
  },
  mainContainer: {
    maxWidth: '1140px',
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
      margin: '0',
    },
  },
  secondaryContainer: {
    padding: '30px 30px 120px',
    flexWrap: 'no-wrap',
    [theme.breakpoints.down('sm')]: {
      padding: '0 0 20px 0',
    },
  },
  paperTile: {
    width: '93px',
    height: '100px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: '10px',
    marginRight: '10px',
    [theme.breakpoints.down('sm')]: {
      margin: '5px',
    },
  },
  textPrimary: {
    color: theme.palette.primary.main,
  },
  buttonPrimary: {
    padding: `${theme.spacing(2.5)} 0`,
    borderRadius: '50px',
    boxShadow: '0 3px 15px 0 #009D8C33',
    textTransform: 'none',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '250px',
      width: '250px',
    },
  },
  buttonAdd: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    left: '-25px',
    width: '40px',
    height: '40px',
    borderRadius: '50px',
    backgroundColor: theme.palette.primary.main,
    zIndex: '2',
    [theme.breakpoints.down('sm')]: {
      left: '45px',
      top: '75%',
    },
  },
  iconAdd: {
    width: '23px',
    height: '23px',
    color: theme.palette.secondary.contrastText,
  },
  videosGrid: {
    position: 'relative',
    top: '-90px',
    display: 'grid',
    gridTemplate:
      '40px 92px 83px 20px 7px 20px 45px 20px 108px 20px 20px 92px 83px 47px / 175px 175px 175px',
    gridGap: '0 20px',
    '& div': {
      position: 'relative',
      '& video': {
        borderRadius: '20px',
      },
    },
    '& .video1': {
      gridRow: '3 / 8',
    },
    '& .video2': {
      gridRow: '1 / 6',
    },
    '& .video3': {
      gridRow: '2 / 4',
    },
    '& .video4': {
      gridRow: '9 / 13',
    },
    '& .video5': {
      gridRow: '7 / 10',
    },
    '& .video6': {
      gridRow: '5 / 11',
    },
    '& .video7': {
      gridRow: '11 / 15',
    },
    '& .video8': {
      gridRow: '12 / 14',
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  preparationIcon: {
    color: theme.palette.primary.main,
    width: '35px',
    height: '35px',
  },
  collaborationIcon: {
    color: theme.palette.primary.main,
    fontSize: '23px',
  },
  iconBox: {
    position: 'relative',
    display: 'flex',
    flexWrap: 'wrap',
    [theme.breakpoints.down('sm')]: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '80px',
    },
  },
  preparingBox: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  },
  opinionCard: {
    maxWidth: '555px',
    height: '295px',
    padding: '14px',
    borderRadius: '20px',
    [theme.breakpoints.down('sm')]: {
      height: 'auto',
    },
  },
  travelTilePaper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '255px',
    height: '264px',
    padding: '35px 25px',
    borderRadius: '20px',
    position: 'relative',
    bottom: '160px',
    transition: 'all 0.3s',
    zIndex: 10,
    '&:hover': {
      bottom: '180px',
      transition: 'all 0.3s',
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: '450px',
      width: 'calc(100vw - 60px)',
      marginRight: '0',
      left: '0px',
      bottom: '120px',
      '&:hover': {
        bottom: '40px',
        transition: 'all 0.3s',
      },
    },
  },
  travelTileDesktopPaper: {
    // Reset ButtonBase
    letterSpacing: '0.01071em',
    backgroundColor: 'white',
  },
  activeTravelTile: {
    bottom: '180px',
  },
  preparationBackground: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80px',
    height: '80px',
    borderRadius: '50px',
    background:
      'linear-gradient(180deg, rgba(230, 245, 244, 0.9) 0%, rgba(230, 245, 244, 0.5) 100%)',
    marginBottom: '25px',
  },
  collaborationBackground: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '60px',
    height: '60px',
    borderRadius: '50px',
    background:
      'linear-gradient(180deg, rgba(230, 245, 244, 0.9) 0%, rgba(230, 245, 244, 0.5) 100%)',
    marginRight: '20px',
  },
  preparationText: {
    color: theme.palette.grey['4f'],
    textAlign: 'center',
    whiteSpace: 'pre-line',
    [theme.breakpoints.down('sm')]: {
      margin: 'auto',
      paddingLeft: '30px',
      paddingRight: '30px',
    },
  },
  textCenter: {
    textAlign: 'center',
  },

  smallSize: {
    width: '28%',
  },
  mediumSize: {
    width: '58%',
    [theme.breakpoints.down('sm')]: {
      width: '250px',
    },
  },
  rotate45Deg: {
    transform: 'rotate(45deg)',
  },
  rotate35Deg: {
    transform: 'rotate(-35deg)',
  },
  travelBoxImage: {
    borderRadius: '20px',
  },
  ultraDark: {
    color: theme.palette.primary.ultraDark,
  },
  colorRed: {
    color: theme.palette.secondary.main,
  },
  weight500: {
    fontWeight: '500',
  },
  grey33: {
    color: '#333333',
  },
  lightGreenBackground: {
    background:
      'linear-gradient(180deg, rgba(230, 245, 244, 0.8) 0%, rgba(230, 245, 244, 0.2) 100%)',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  collaborationBox: {
    display: 'flex',
    flexDirection: 'column',
  },
  workingBox: {
    display: 'grid',
    gridTemplate: '1fr / repeat(3, 360px)',
    gridGap: '30px',
    justifyContent: 'center',
    alignItems: 'start',
    marginBottom: '50px',
    [theme.breakpoints.down('sm')]: {
      gridTemplate: 'repeat(3, 1fr) / 360px',
      gridGap: '60px',
    },
  },
  workingEmoji: {
    fontSize: '3.125rem',
  },
  opinionUserPicture: {
    borderRadius: '50px',
  },
  opinionProfileUser: {
    display: 'grid',
    gridTemplate: '1fr / max-content 1fr',
    gridGap: '10px',
    alignItems: 'center',
    marginBottom: '15px',
  },
  customTrendingDestinationsDotBox: {
    right: 'unset',
    [theme.breakpoints.down('sm')]: {
      right: '0',
    },
  },
  newsLabel: {
    fontSize: '1.125rem',
    color: theme.palette.primary.main,
    lineHeight: '21.33px',
    fontWeight: '500',
    textTransform: 'uppercase',
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: '600',
    },
  },
  newsTitle: {
    fontSize: '1.375rem',
    fontWeight: '500',
    lineHeight: '26px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '18px',
      lineHeight: '21px',
    },
  },
  blogList: {
    maxWidth: '550px',
    borderRadius: '20px',
    [theme.breakpoints.down('sm')]: {
      maxWidth: 'unset',
    },
  },
  buttonBlogList: {
    textTransform: 'none',
    width: '100%',
    display: 'flex',
    textAlign: 'auto',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    fontSize: '2.125rem',
  },
  stroke: {
    margin: '0 30px',
    [theme.breakpoints.down('sm')]: {
      margin: '0 20px',
    },
  },
  buttonsSpot: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    top: '76px',
    left: '-20px',
    zIndex: '3',
    height: '100px',
  },
  logoSpot: {
    position: 'absolute',
    left: '40%',
    top: '30%',
    [theme.breakpoints.down('sm')]: {
      width: '80px',
      top: '20%',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    '@media (min-width: 600px) and (max-width: 960px)': {
      top: '50%',
      transform: 'translate(-50%, -50%)',
    },
  },
  destinationBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselArrow: {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.ultraLight,
    borderRadius: '5px',
    width: '70px',
    height: '45px',
    '&:hover': {
      backgroundColor: theme.palette.primary.ultraLight,
    },
  },
  buttonNewsletter: {
    borderRadius: '29px',
    boxShadow: '0 3px 15px 0 rgba(0, 157, 140, 0.2)',
    textTransform: 'none',
    width: '35%',
    padding: '14px 25px',
    [theme.breakpoints.down('sm')]: {
      width: '62%',
    },
  },
  v5MuiBUttonFix: {
    // TODO Mui v5 error ?
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  paperNewsletter: {
    position: 'relative',
    top: '115px',
    display: 'flex',
    width: '70%',
    maxWidth: '830px',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 0 60px 0',
    borderRadius: '30px',
    [theme.breakpoints.down('sm')]: {
      top: '0',
      justifyContent: 'center',
    },
  },
  shadowBoxNewsletter: {
    filter: 'blur(80px)',
    background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 19.27%, rgba(0, 0, 0, 0.24) 100%)',
  },
  inputNewsletter: {
    width: '400px',
    borderRadius: '29px',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '275px',
      marginBottom: '20px',
      backgroundColor: theme.palette.secondary.contrastText,
    },
  },
  fs34: {
    fontSize: '2.125rem',
  },
  planificationContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '140px',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  },
  argumentItem: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '490px',
    [theme.breakpoints.down('sm')]: {
      maxWidth: 'unset',
    },
  },
  formNewsletter: {
    display: 'flex',
    alignItems: 'center',
  },

  // Responsive Part
  mobileTextCenter: {
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
  mobileAlignCenter: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  mobileSizing: {
    [theme.breakpoints.down('sm')]: {
      maxWidth: 'calc(100vw - 60px)',
    },
  },
  mobileFlexColumn: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  mobileTitle: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '38px',
      lineHeight: '43px',
    },
  },
  mobileSmallTitle: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '22px',
      lineHeight: '26px',
      fontWeight: '500',
      fontFamily: theme.fontFamily,
    },
  },
  mobileSubtitle: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '18px',
      fontWeight: '500',
      lineHeight: '21px',
    },
  },
  mobileFlexWrapReverse: {
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap-reverse',
    },
  },
  mobileButton: {
    [theme.breakpoints.down('sm')]: {
      width: '70%',
    },
  },
  mobileMarginBottom: {
    [theme.breakpoints.down('sm')]: {
      marginBottom: '40px',
    },
  },
  focusImg: {
    maxWidth: '810px',
    maxHeight: '580px',
    borderRadius: '20px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      maxWidth: 'unset',
      maxHeight: '300px',
      borderRadius: '0',
    },
    '@media (min-width: 600px) and (max-width: 960px)': {
      height: '450px',
      maxHeight: 'unset',
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
  mobileAdaptedProject: {
    minHeight: '335px',
  },
  nextLink: {
    textDecoration: 'none',
  },
}))

export async function getStaticPaths() {
  return {
    paths: [
      { params: { slug: 'evg' } },
      { params: { slug: 'evjf' } },
      { params: { slug: 'citytrip' } },
    ],
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }) {
  const { slug } = params
  const doc = await database.ref().child(`page_structure/home_pages/${slug}`).get()
  let dataset
  let dictionary
  let homePage
  let periodeVisited
  if (doc.exists()) {
    dataset = doc.val()
    const dictionaryDoc = await database.ref().child(`dictionary`).get()
    if (dictionaryDoc.exists()) {
      dictionary = dictionaryDoc.val()
      periodeVisited = dictionary.periode_visite
    }
    const homePageDoc = await database.ref().child(`page_structure/accueil`).get()
    if (homePageDoc.exists()) {
      homePage = homePageDoc.val()
    }
  } else {
    return {
      notFound: true,
    }
  }

  let metaDoc
  try {
    metaDoc = await database.ref().child(`page_structure/home_pages/${slug}`).get()
  } catch (error) {
    console.error(error)
    return { notFound: true }
  }

  const welcomePageData = metaDoc.val()
  console.log('spotData', welcomePageData)
  const tags = welcomePageData?.tags || {}

  return {
    props: { dataset, periodeVisited, homePage, slug, tags },
    revalidate: 1,
  }
}

const WelcomePage = ({ dataset }) => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  const {
    '0_header': headerContent,
    '1_encart_blog_1grand_4petits': encartContent,
    '2_slider_destinations': sliderDestinationsContent,
    '2_2_slider_destinations': secondSliderDestinationsContent,
    '3_thematiques_recherche': thematicSearchContent,
    '4_contenu_thematique_3_articles': trendingSpotContent,
    '5_argument_1': firstArgumentContent,
    '6_argument_2': secondArgumentContent,
    '7_argument_3': thirdArgumentContent,
    '8_argument_4': fourthArgumentContent,
    '9_argument_5': fifthArgumentContent,
    '10_slider_photos_arguments': photosSliderArguments,
    '11_selection_article_x3': articlesSelection,
    intro_explomaker: introExplomaker,
  } = dataset

  const [email, setEmail] = useState('')
  const [currentSlideDesktopPart6, setCurrentSlideDesktopPart6] = useState(0)
  const [currentSlideSpot, setCurrentSlideSpot] = useState(0)
  const [trendingDestinationsItems, setTrendingDestinationsItems] = useState([])
  const [secondTrendingDestinationsItems, setSecondTrendingDestinationsItems] = useState([])
  const [currentPublicPresentation, setCurrentPublicPresentation] = useState([])
  const [currentHeartStrokes, setCurrentHeartStrokes] = useState([])
  const [showGoTop, setShowGoTop] = useState()
  const [isEmailSent, setIsEmailSent] = useState(false)
  const refScrollUp = useRef(null)

  useEffect(() => {
    const trendingDestinationsKeys = Object.keys(sliderDestinationsContent?.spots)
    const tempTrendingDestinationsArray = trendingDestinationsKeys.map(
      currentKey => sliderDestinationsContent.spots[currentKey]
    )
    setTrendingDestinationsItems(tempTrendingDestinationsArray)
  }, [sliderDestinationsContent])

  useEffect(() => {
    if (secondSliderDestinationsContent?.spots) {
      const trendingDestinationsKeys = Object.keys(secondSliderDestinationsContent?.spots)
      const tempTrendingDestinationsArray = trendingDestinationsKeys.map(
        currentKey => secondSliderDestinationsContent.spots[currentKey]
      )
      setSecondTrendingDestinationsItems(tempTrendingDestinationsArray)
    }
  }, [secondSliderDestinationsContent])

  useEffect(() => {
    console.log('dataset', dataset)
    console.log('trendingDestinationsItems', trendingDestinationsItems)
    console.log('le lien', `${headerContent?.lien_video_1}`)
  }, [dataset, trendingDestinationsItems, headerContent])

  return (
    <>
      {dataset?.tags && <Head tags={dataset?.tags} />}
      <Box ref={refScrollUp} />
      {!matchesXs && (
        <GoTopBtn
          show={showGoTop}
          scrollUp={() => refScrollUp.current.scrollIntoView({ behavior: 'smooth' })}
        />
      )}
      {matchesXs && <MobileSearchButton />}
      <Box className={classes.fullWidthContainer}>
        <Box className={classes.greenBackgroundContainer}>
          <Box className={classes.mainContainer}>
            {matchesXs && (
              <Box display="flex" justifyContent="center" sx={{ position: 'relative' }} top="65px">
                <Image
                  src={logoFull}
                  width={250}
                  height={60}
                  alt="mainLogo_image"
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                  }}
                />
              </Box>
            )}
            <Box
              display="flex"
              className={classes.secondaryContainer}
              marginTop="160px"
              flexWrap="wrap"
              justifyContent={matchesXs ? 'center' : 'space-between'}
            >
              <Box
                display="flex"
                flexDirection="column"
                maxWidth={matchesXs ? '375px' : '480px'}
                className={classes.mobileAlignCenter}
              >
                <Box marginBottom="20px">
                  <Typography
                    variant="h1"
                    component="h1"
                    className={clsx(classes.mobileTextCenter, classes.headerTitle)}
                    dangerouslySetInnerHTML={{ __html: headerContent?.titre }}
                  />
                </Box>
                <Box marginBottom="40px">
                  <Typography variant="body1" className={classes.mobileTextCenter}>
                    {headerContent?.accroche}
                  </Typography>
                </Box>
                <Box>
                  <Box
                    marginBottom="20px"
                    sx={{
                      [theme.breakpoints.down('sm')]: { display: 'flex', justifyContent: 'center' },
                    }}
                  >
                    <Link
                      href="https://app.explomaker.fr"
                      passHref
                      target="_blank"
                      className={classes.nextLink}
                    >
                      <Button
                        variant="contained"
                        className={clsx(classes.buttonPrimary, classes.v5MuiBUttonFix)}
                        fullWidth={!matchesXs}
                      >
                        {headerContent?.call_to_action}
                      </Button>
                    </Link>
                  </Box>
                  <Box display="flex" justifyContent="space-evenly" flexWrap="wrap">
                    <Box display="flex" alignItems="center">
                      <Check color="primary" />
                      <Typography sx={{ [theme.breakpoints.down('sm')]: { maxWidth: '60vw' } }}>
                        {headerContent?.bonus[0]}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Check color="primary" />
                      <Typography sx={{ [theme.breakpoints.down('sm')]: { maxWidth: '60vw' } }}>
                        {headerContent?.bonus[1]}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Check color="primary" className={classes.checkIcons} />
                      <Typography sx={{ [theme.breakpoints.down('sm')]: { maxWidth: '60vw' } }}>
                        {headerContent?.bonus[2]}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ position: 'relative' }} width="570px">
                <Box position="absolute" top="0" left="0">
                  <Box className={classes.videosGrid}>
                    <Box className="video1">
                      <ReactPlayer
                        url={`${headerContent?.lien_video_1}`}
                        loop
                        playing
                        volume={0}
                        muted
                        width="175px"
                        height="175px"
                      />
                    </Box>
                    <Box className="video2">
                      <ReactPlayer
                        url={headerContent?.lien_video_2}
                        loop
                        playing
                        volume={0}
                        muted
                        width="175px"
                        height="242px"
                      />
                    </Box>
                    <Box className="video3">
                      <ReactPlayer
                        url={headerContent?.lien_video_3}
                        loop
                        playing
                        volume={0}
                        muted
                        width="175px"
                        height="175px"
                      />
                    </Box>
                    <Box className="video4">
                      <ReactPlayer
                        url={headerContent?.lien_video_4}
                        loop
                        playing
                        volume={0}
                        muted
                        width="175px"
                        height="242px"
                      />
                    </Box>
                    <Box className="video5">
                      <ReactPlayer
                        url={headerContent?.lien_video_5}
                        loop
                        playing
                        volume={0}
                        muted
                        width="175px"
                        height="173px"
                      />
                    </Box>
                    <Box className="video6">
                      <ReactPlayer
                        url={headerContent?.lien_video_6}
                        loop
                        playing
                        volume={0}
                        muted
                        width="175px"
                        height="220px"
                      />
                    </Box>
                    <Box className="video7">
                      <ReactPlayer
                        url={headerContent?.lien_video_7}
                        loop
                        playing
                        volume={0}
                        muted
                        width="175px"
                        height="242px"
                      />
                    </Box>
                    <Box className="video8">
                      <ReactPlayer
                        url={headerContent?.lien_video_8}
                        loop
                        playing
                        volume={0}
                        muted
                        width="175px"
                        height="175px"
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        {/* Fin de la partie Header */}
        {/* Partie Encart */}
        <Box className={classes.greyBackgroundContainer}>
          <Box className={classes.mainContainer} padding="60px 0">
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <Box marginBottom="20px">
                  <Typography
                    variant="subtitle1"
                    className={clsx(
                      classes.mobileSubtitle,
                      classes.mobileTextCenter,
                      classes.ultraDark
                    )}
                  >
                    {encartContent?.sur_titre}
                  </Typography>
                </Box>
                <Box marginBottom="50px" className={classes.mobileSizing}>
                  <Typography
                    variant="h1"
                    component="h2"
                    className={clsx(classes.mobileTitle, classes.mobileTextCenter)}
                  >
                    {encartContent?.titre}
                  </Typography>
                </Box>
              </Box>
              <Box
                width="100%"
                display="flex"
                flexWrap="wrap"
                marginBottom="50px"
                justifyContent="space-between"
                alignItems="center"
                className={clsx(classes.mobileMarginBottom, classes.mobileAlignCenter)}
              >
                <Box className={classes.mobileAlignCenter}>
                  <BlogCard
                    bigTitle={encartContent?.articles[0]?.title}
                    category={
                      encartContent?.articles[0]?.name ||
                      encartContent?.articles[0]?.sub_type[0].name
                    }
                    srcImg={`https://storage.googleapis.com/explomaker-data-stateless/${encartContent?.articles[0]?.picture.src.original}`}
                    altImg=""
                    date={encartContent?.articles[0]?.creation_date}
                    readingTime={encartContent?.articles[0]?.reading_time}
                    link={encartContent?.articles[0]?.target_url}
                  />
                </Box>
                <Paper elevation={2} className={clsx(classes.mobileSizing, classes.blogList)}>
                  {encartContent?.articles
                    ?.filter((article, index) => index !== 0)
                    .map(
                      (
                        { title, sub_type: subType, target_url: targetURL },
                        index,
                        currentArray
                      ) => (
                        <Box key={`hotArticles${title}`}>
                          <Link
                            passhref
                            href={targetURL}
                            target="_blank"
                            className={classes.nextLink}
                          >
                            <Button
                              className={classes.buttonBlogList}
                              endIcon={
                                <ArrowRightAlt
                                  sx={{
                                    color: '#DFDFDF',
                                    fontSize: '2.125rem',
                                    width: '34px',
                                    height: '34px',
                                  }}
                                />
                              }
                              sx={{
                                borderRadius:
                                  index === 0
                                    ? '20px 20px 0 0'
                                    : index === currentArray.length - 1
                                    ? '0 0 20px 20px'
                                    : '0',
                              }}
                            >
                              <Box className={classes.newsTitleLabel}>
                                <Box marginBottom="10px">
                                  <Typography
                                    className={classes.newsLabel}
                                    dangerouslySetInnerHTML={{ __html: subType[0].name }}
                                  />
                                </Box>
                                <Typography
                                  className={classes.newsTitle}
                                  dangerouslySetInnerHTML={{ __html: title }}
                                />
                              </Box>
                            </Button>
                          </Link>
                          {index !== currentArray.length - 1 && (
                            <Divider className={classes.stroke} />
                          )}
                        </Box>
                      )
                    )}
                </Paper>
              </Box>
              <Link
                component={IconButton}
                passhref
                href="/inspiration"
                target="_blank"
                className={classes.nextLink}
              >
                <Button
                  variant="contained"
                  className={clsx(classes.buttonPrimary, classes.v5MuiBUttonFix)}
                  sx={{ minWidth: '250px' }}
                >
                  Plus de lecture ?
                </Button>
              </Link>
            </Box>
          </Box>
        </Box>
        {/* Fin de la partie encart blog */}
        {/* Partie sliderDestinations */}
        <Box
          className={classes.whiteBackgroundContainer}
          sx={{ marginBottom: matchesXs ? '130px' : '80px', paddingTop: '30px' }}
        >
          <Box className={classes.mainContainer}>
            {trendingDestinationsItems.length > 0 && (
              <TrendingDestinations
                trendingDestinationsItems={trendingDestinationsItems}
                dotListClass={classes.customTrendingDestinationsDotBox}
                argumentData={sliderDestinationsContent}
              />
            )}
          </Box>
        </Box>
        {/* Fin de partie sliderDestinations */}
        {/* Partie secondSliderDestinations */}
        {secondTrendingDestinationsItems.length > 0 && (
          <Box
            className={classes.whiteBackgroundContainer}
            sx={{ marginBottom: matchesXs ? '130px' : '80px', paddingTop: '30px' }}
          >
            <Box className={classes.mainContainer}>
              <TrendingDestinations
                trendingDestinationsItems={secondTrendingDestinationsItems}
                dotListClass={classes.customTrendingDestinationsDotBox}
                argumentData={secondSliderDestinationsContent}
              />
            </Box>
          </Box>
        )}
        {/* Fin de partie secondSliderDestinations */}
        {/* Partie thématiques */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{ width: !matchesXs ? '1140px' : '100vw', padding: matchesXs ? '30px' : '60px 0' }}
          >
            <Typography
              variant="h6"
              color="primary.ultraDark"
              fontWeight="400"
              sx={{ marginBottom: '10px', textAlign: matchesXs && 'center' }}
            >
              {thematicSearchContent?.sur_titre}
            </Typography>
            <Typography
              variant="h1"
              component="h2"
              sx={{ marginBottom: '30px', textAlign: matchesXs && 'center' }}
            >
              {thematicSearchContent?.titre}
            </Typography>
            <Box className={classes.thematicGridContainer}>
              {thematicSearchContent?.thematiques?.map(
                ({ name: thematicName, picture, target_url: link }) => (
                  <ThematicCard
                    key={thematicName}
                    title={thematicName}
                    srcImg={`${picture?.src?.large}`}
                    link={link}
                  />
                )
              )}
            </Box>
          </Box>
        </Box>
        {/* fin de la Partie thématiques */}
        {/* Partie Focus */}
        <Box className={classes.whiteBackgroundContainer} padding="60px 0 0 0">
          <Box className={classes.mainContainer}>
            <Box>
              <Box
                display="flex"
                alignItems="center"
                flexDirection="column"
                sx={{ position: 'relative' }}
                marginBottom={matchesXs ? '0' : '150px'}
                className={clsx(classes.mobileAlignCenter, classes.mobileFlexColumn)}
              >
                <Box marginBottom="20px">
                  <Typography
                    variant="subtitle1"
                    className={clsx(classes.mobileSubtitle, classes.ultraDark)}
                  >
                    {trendingSpotContent?.sur_titre}
                  </Typography>
                </Box>
                <Box marginBottom="50px" className={classes.mobileSizing}>
                  <Typography
                    variant="h1"
                    component="h2"
                    className={clsx(classes.mobileTextCenter, classes.mobileTitle)}
                  >
                    {trendingSpotContent?.titre}
                  </Typography>
                </Box>
                {matchesXs ? (
                  <Box
                    display="flex"
                    alignItems="center"
                    className={clsx(classes.mobileAlignCenter, classes.mobileFlexColumn)}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100vw',
                        height: '300px',
                        '@media (min-width: 600px) and (max-width: 960px)': {
                          height: '450px',
                        },
                      }}
                    >
                      <Carousel
                        infinite={false}
                        navButtonsAlwaysInvisible
                        indicators={false}
                        animation="slide"
                        autoPlay={false}
                      >
                        {trendingSpotContent?.liens[0].links.map(spot => (
                          <Box
                            key={spot.picture.src.id}
                            minWidth="100%"
                            sx={{
                              position: 'relative',
                              height: '300px',
                              '@media (min-width: 600px) and (max-width: 960px)': {
                                height: '450px',
                              },
                            }}
                          >
                            <Image
                              src={`https://storage.googleapis.com/explomaker-data-stateless/${encodeURI(
                                spot.picture.src.original
                              )}`}
                              alt="trendingSpot_image"
                              className={classes.focusImg}
                              fill
                              sizes="100vw"
                            />
                            {/* <LinearProgress variant="determinate" value="0" /> */}
                            <Box className={classes.logoSpot}>
                              <Image
                                src={logo}
                                width="169"
                                height="209"
                                quality={100}
                                alt="spot_logo"
                                style={{
                                  maxWidth: '100%',
                                  height: 'auto',
                                  objectFit: 'cover',
                                  objectPosition: 'center',
                                }}
                              />
                            </Box>
                          </Box>
                        ))}
                      </Carousel>
                    </Box>
                    <SpotCard data={trendingSpotContent.liens[0]} />
                  </Box>
                ) : (
                  /* Desktop ver */
                  <Box display="flex" alignSelf="flex-start" flexDirection="column">
                    <Box sx={{ position: 'relative' }}>
                      <Box className={classes.buttonsSpot}>
                        <Button
                          className={classes.carouselArrow}
                          onClick={() => {
                            let previousIndex
                            if (currentSlideSpot > 0) {
                              previousIndex = currentSlideSpot - 1
                            } else {
                              previousIndex = trendingSpotContent.liens[0].links.length - 1
                            }
                            setCurrentSlideSpot(previousIndex)
                          }}
                        >
                          <ArrowRightAlt style={{ transform: 'rotate(180deg)' }} fontSize="large" />
                        </Button>
                        <Button
                          className={classes.carouselArrow}
                          onClick={() =>
                            setCurrentSlideSpot(
                              currentSlideSpot < trendingSpotContent.liens[0].links.length - 1
                                ? currentSlideSpot + 1
                                : 0
                            )
                          }
                        >
                          <ArrowRightAlt fontSize="large" />
                        </Button>
                      </Box>
                      <Box sx={{ width: '810px', height: '580px', position: 'relative' }}>
                        <Carousel
                          indicators={false}
                          navButtonsAlwaysInvisible
                          animation="fade"
                          duration={1000}
                          index={currentSlideSpot}
                          onChange={currentIndex => setCurrentSlideSpot(currentIndex)}
                          autoPlay={false}
                        >
                          {trendingSpotContent.liens[0].links.map(spot => (
                            <Box
                              key={spot.picture.src.id}
                              width="810px"
                              height="580px"
                              sx={{ position: 'relative' }}
                            >
                              <Image
                                src={`https://storage.googleapis.com/explomaker-data-stateless/${encodeURI(
                                  spot.picture.src.original
                                )}`}
                                alt="spotPicture_image"
                                className={classes.focusImg}
                                fill
                                sizes="100vw"
                              />
                              <Box className={classes.logoSpot}>
                                <Image
                                  src={logo}
                                  width="169"
                                  height="209"
                                  quality={100}
                                  alt="spotPicture_logo"
                                  style={{
                                    maxWidth: '100%',
                                    height: 'auto',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                  }}
                                />
                              </Box>
                              {/* <LinearProgress variant="determinate" value="0" /> */}
                            </Box>
                          ))}
                        </Carousel>
                      </Box>
                    </Box>
                    <SpotCard data={trendingSpotContent.liens[0]} />
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
        {/* Fin de la partie Focus */}
        {/* partie IA * */}
        <Box
          className={classes.greyBackgroundContainer}
          sx={{ paddingTop: '90px', paddingBottom: '30px' }}
        >
          <Box className={classes.mainContainer}>
            <Typography
              variant="h1"
              component="h1"
              className={clsx(classes.mobileTextCenter, classes.headerTitle)}
              dangerouslySetInnerHTML={{ __html: introExplomaker }}
              sx={{ maxWidth: '70%', margin: matchesXs && 'auto' }}
            />
            <Box
              className={clsx(classes.mobileFlexWrapReverse, classes.page2)}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '90px',
                marginBottom: '60px',
              }}
            >
              <Image
                src={`https://storage.googleapis.com/explomaker-data-stateless/${firstArgumentContent?.picture.src.original}`}
                width={matchesXs ? 340 : 540}
                height={matchesXs ? 340 : 540}
                quality={100}
                alt="illustrationComplete_image"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '20px',
                }}
              />
              <Box
                maxWidth="540px"
                margin="40px"
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                className={classes.mobileAlignCenter}
              >
                <Box marginBottom="20px">
                  <Typography
                    variant="subtitle1"
                    className={clsx(
                      classes.ultraDark,
                      classes.mobileTextCenter,
                      classes.mobileSubtitle
                    )}
                  >
                    {firstArgumentContent?.sur_titre}
                  </Typography>
                </Box>
                <Box marginBottom="20px">
                  <Typography
                    variant="h1"
                    component="h2"
                    className={clsx(classes.mobileTextCenter, classes.mobileTitle)}
                  >
                    {firstArgumentContent?.titre}
                  </Typography>
                </Box>
                <Box marginBottom="40px">
                  <Typography variant="body1" className={classes.mobileTextCenter}>
                    {firstArgumentContent?.texte}
                  </Typography>
                </Box>
                <Link
                  href="https://app.explomaker.fr"
                  passHref
                  target="_blank"
                  className={classes.nextLink}
                >
                  <Button
                    variant="contained"
                    className={clsx(classes.buttonPrimary, classes.v5MuiBUttonFix)}
                    sx={{ minWidth: '250px' }}
                  >
                    {firstArgumentContent?.call_to_action}
                  </Button>
                </Link>
              </Box>
            </Box>
          </Box>
        </Box>
        {/* Fin de la partie IA */}
        {/* Partie argument 2 */}
        <Box className={classes.whiteBackgroundContainer} sx={{ paddingTop: '90px' }}>
          <Box className={classes.mainContainer}>
            <Box className={classes.planificationContainer}>
              <Box
                display="flex"
                flexDirection="column"
                className={clsx(classes.mobileSizing, classes.mobileAlignCenter)}
              >
                <Box
                  maxWidth="550px"
                  className={clsx(
                    classes.mobileAlignCenter,
                    classes.mobileSizing,
                    classes.mobileFlexColumn
                  )}
                >
                  <Box marginBottom="20px">
                    <Typography
                      variant="subtitle1"
                      className={clsx(
                        classes.mobileTextCenter,
                        classes.mobileSubtitle,
                        classes.ultraDark
                      )}
                    >
                      {secondArgumentContent?.sur_titre}
                    </Typography>
                  </Box>
                  <Box marginBottom="20px">
                    <Typography
                      variant="h1"
                      component="h2"
                      className={clsx(classes.mobileTextCenter, classes.mobileTitle)}
                    >
                      {secondArgumentContent?.titre}
                    </Typography>
                  </Box>
                  <Box marginBottom="50px">
                    <Typography variant="body1" className={classes.mobileTextCenter}>
                      {secondArgumentContent?.texte}
                    </Typography>
                  </Box>
                </Box>
                {matchesXs ? (
                  <Box className={classes.iconBox}>
                    {tiles.map(({ Icon, label }) => (
                      <Paper elevation={2} className={classes.paperTile} key={label}>
                        {label === 'Vols A/R' ? (
                          <>
                            <Box className={classes.lightGreenBackground}>
                              <Icon
                                className={clsx(classes.ultraDark, {
                                  [classes.rotate45Deg]: label === 'Vols A/R',
                                })}
                              />
                              <Box className={classes.buttonAdd}>
                                <Add className={classes.iconAdd} />
                              </Box>
                            </Box>
                          </>
                        ) : (
                          <Box className={classes.lightGreenBackground}>
                            <Icon
                              className={clsx(classes.ultraDark, {
                                [classes.rotate45Deg]: label === 'Vols A/R',
                              })}
                            />
                          </Box>
                        )}
                        <Typography variant="subtitle2">{label}</Typography>
                      </Paper>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ position: 'relative' }}>
                    <Box className={classes.buttonAdd}>
                      <Add className={classes.iconAdd} />
                    </Box>
                    <Box className={classes.iconBox}>
                      {tiles.map(({ Icon, label }) => (
                        <Paper elevation={2} className={classes.paperTile} key={label}>
                          <Box className={classes.lightGreenBackground}>
                            <Icon
                              className={clsx(classes.ultraDark, {
                                [classes.rotate45Deg]: label === 'Vols A/R',
                              })}
                            />
                          </Box>
                          <Typography variant="subtitle2">{label}</Typography>
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
              <Box
                sx={{
                  position: 'relative',
                  width: '537px',
                  height: '537px',
                  [theme.breakpoints.down('sm')]: { width: '360px', height: '360px' },
                  '@media (min-width: 600px) and (max-width: 960px)': {
                    width: '70vw',
                  },
                }}
              >
                <Image
                  src={`https://storage.googleapis.com/explomaker-data-stateless/${secondArgumentContent?.picture.src.large}`}
                  quality={100}
                  fill
                  alt="planning_illustration"
                  style={{
                    maxWidth: '100%',
                    borderRadius: '20px',
                    alignSelf: 'flex-start',
                    objectFit: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
        {/* Fin de partie 3 */}
        {/* Partie 4 */}
        <Box className={classes.whiteBackgroundContainer}>
          <Box className={classes.mainContainer}>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              marginBottom="150px"
            >
              <Box marginBottom="60px">
                <Box marginBottom="25px">
                  <Typography
                    variant="subtitle1"
                    className={clsx(
                      classes.mobileSubtitle,
                      classes.mobileTextCenter,
                      classes.textCenter,
                      classes.ultraDark
                    )}
                    sx={{ paddingX: '30px' }}
                  >
                    {thirdArgumentContent?.sur_titre}
                  </Typography>
                </Box>
                <Typography
                  variant="h1"
                  component="h2"
                  className={clsx(classes.mobileTextCenter, classes.mobileTitle)}
                  sx={{ paddingX: '30px' }}
                >
                  {thirdArgumentContent?.titre}
                </Typography>
              </Box>
              <Box className={classes.preparingBox}>
                {matchesXs ? (
                  <Box
                    sx={{
                      width: '100vw',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Box sx={{ width: '255px' }}>
                      <Carousel
                        navButtonsAlwaysInvisible
                        indicatorIconButtonProps={{
                          style: { padding: '7px', color: '#E6F5F4' },
                        }}
                        activeIndicatorIconButtonProps={{
                          style: {
                            color: '#009D8C',
                          },
                        }}
                      >
                        {itemsPreparation.map(({ Icon, label }, index) => (
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            maxWidth="255px"
                            key={label}
                          >
                            <Box className={classes.preparationBackground}>
                              <Icon className={classes.preparationIcon} />
                            </Box>
                            <Box marginBottom="10px">
                              <Typography variant="h6">{label}</Typography>
                            </Box>
                            <Typography variant="body1" className={classes.preparationText}>
                              {index === 0
                                ? thirdArgumentContent?.planning
                                : index === 1
                                ? thirdArgumentContent?.exploration
                                : index === 2 && thirdArgumentContent?.inspiration}
                            </Typography>
                          </Box>
                        ))}
                      </Carousel>
                    </Box>
                  </Box>
                ) : (
                  itemsPreparation.map(({ Icon, label }, index) => (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        maxWidth: '255px',
                        marginX: '20px',
                      }}
                      key={label}
                    >
                      <Box className={classes.preparationBackground}>
                        <Icon className={classes.preparationIcon} />
                      </Box>
                      <Box marginBottom="10px">
                        <Typography variant="h6">{label}</Typography>
                      </Box>
                      <Typography variant="body1" className={classes.preparationText}>
                        {index === 0
                          ? thirdArgumentContent?.planning
                          : index === 1
                          ? thirdArgumentContent?.exploration
                          : index === 2 && thirdArgumentContent?.inspiration}
                      </Typography>
                    </Box>
                  ))
                )}
              </Box>
            </Box>
          </Box>
        </Box>
        {/* Fin de la partie 4 */}
        {/* Partie 7 */}
        <Box className={classes.whiteBackgroundContainer}>
          <Box className={classes.mainContainer}>
            <Box>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                marginBottom="150px"
              >
                <Box marginBottom="20px">
                  <Typography
                    variant="subtitle1"
                    className={clsx(
                      classes.mobileTextCenter,
                      classes.mobileSubtitle,
                      classes.ultraDark
                    )}
                  >
                    {fourthArgumentContent?.sur_titre}
                  </Typography>
                </Box>
                <Box
                  marginBottom="50px"
                  className={classes.mobileSizing}
                  sx={{
                    [theme.breakpoints.down('sm')]: {
                      display: 'flex',
                      justifyContent: 'center',
                    },
                  }}
                >
                  <Typography
                    variant="h1"
                    component="h2"
                    className={clsx(classes.mobileTitle, classes.mobileTextCenter)}
                  >
                    {fourthArgumentContent?.titre}
                  </Typography>
                </Box>
                <Box className={classes.workingBox}>
                  {fourthArgumentContent?.arguments.map(({ icone, titre, texte }, index) => (
                    <Box display="flex" flexDirection="column" alignItems="center" key={titre}>
                      <Box marginBottom="25px">
                        <Typography className={classes.workingEmoji}>{icone}</Typography>
                      </Box>
                      <Box marginBottom="10px">
                        <Typography variant="h6" sx={{ textAlign: matchesXs && 'center' }}>
                          {`${index + 1} - `}
                          <Box component="span" className={classes.textPrimary}>
                            {titre}
                          </Box>
                        </Typography>
                      </Box>
                      <Typography variant="body1" className={classes.preparationText}>
                        {texte}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Link
                  href="https://app.explomaker.fr"
                  passHref
                  target="_blank"
                  className={classes.nextLink}
                >
                  <Button
                    variant="contained"
                    className={clsx(
                      classes.buttonPrimary,
                      classes.smallSize,
                      classes.v5MuiBUttonFix
                    )}
                    sx={{ minWidth: '250px' }}
                  >
                    Crée ton séjour
                  </Button>
                </Link>
              </Box>
            </Box>
          </Box>
        </Box>
        {/* Fin de partie 7 */}
        {/* Partie 5 */}
        <Box className={classes.whiteBackgroundContainer}>
          <Box className={classes.mainContainer}>
            <Box
              display="flex"
              alignItems="center"
              marginBottom="150px"
              flexWrap="wrap-reverse"
              justifyContent="space-between"
              className={clsx(classes.mobileAlignCenter, classes.mobileReverseRow)}
            >
              <Box
                sx={{
                  width: '537px',
                  height: '537px',
                  position: 'relative',
                  [theme.breakpoints.down('sm')]: {
                    width: '360px',
                    height: '360px',
                    '@media (min-width: 600px) and (max-width: 960px)': {
                      width: '70vw',
                    },
                  },
                }}
              >
                <Image
                  src={`https://storage.googleapis.com/explomaker-data-stateless/${encodeURI(
                    fifthArgumentContent?.picture.src?.original
                  )}`}
                  fill
                  quality={100}
                  alt="collab_illustration"
                  style={{
                    maxWidth: '100%',
                    borderRadius: '20px',
                  }}
                />
              </Box>
              <Box
                maxWidth="570px"
                display="flex"
                flexDirection="column"
                className={clsx(classes.mobileSizing, classes.mobileMarginBottom)}
              >
                <Box marginBottom="20px">
                  <Typography
                    variant="subtitle1"
                    className={clsx(
                      classes.mobileSubtitle,
                      classes.mobileTextCenter,
                      classes.ultraDark
                    )}
                  >
                    {fifthArgumentContent?.sur_titre}
                  </Typography>
                </Box>
                <Box marginBottom="50px">
                  <Typography
                    variant="h1"
                    component="h2"
                    className={clsx(classes.mobileTextCenter, classes.mobileTitle)}
                  >
                    {fifthArgumentContent?.titre}
                  </Typography>
                </Box>
                <Box className={classes.collaborationBox}>
                  {fifthArgumentContent?.arguments &&
                    fifthArgumentContent?.arguments.map(({ icone, titre, texte }) => (
                      <Box display="flex" alignItems="center" key={titre} marginBottom="40px">
                        <Box className={classes.collaborationBackground}>
                          <Typography className={classes.collaborationIcon}>{icone}</Typography>
                        </Box>
                        <Box className={classes.argumentItem}>
                          <Typography variant="h6">{titre}</Typography>
                          <Typography variant="body1" className={classes.collaborationText}>
                            {texte}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        {/* Fin de partie 5 */}
        {/* Partie 6 */}
        <Box className={classes.whiteBackgroundContainer}>
          <Box className={classes.mainContainer}>
            <Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <Box marginBottom="20px">
                  <Typography
                    variant="subtitle1"
                    className={clsx(
                      classes.mobileSubtitle,
                      classes.mobileTextCenter,
                      classes.ultraDark
                    )}
                  >
                    Pensé pour tous
                  </Typography>
                </Box>
                <Box marginBottom="50px">
                  <Typography
                    variant="h1"
                    component="h2"
                    className={clsx(classes.mobileTitle, classes.mobileTextCenter)}
                  >
                    Adapté à tous tes projets de voyage
                  </Typography>
                </Box>
                <Box marginBottom={matchesXs && '80px'}>
                  {matchesXs ? (
                    <Box sx={{ width: '100vw', height: '600px', position: 'relative' }}>
                      <Carousel
                        navButtonsAlwaysInvisible
                        autoPlay={false}
                        animation="slide"
                        indicatorIconButtonProps={{
                          style: { padding: '7px', color: '#E6F5F4' },
                        }}
                        activeIndicatorIconButtonProps={{
                          style: {
                            color: '#009D8C',
                          },
                        }}
                        indicatorContainerProps={{
                          style: {
                            position: 'relative',
                            top: '-40px',
                          },
                        }}
                      >
                        {photosSliderArguments?.elements &&
                          photosSliderArguments.elements.map(
                            ({ logo: publicLogo, titre, texte, photo }) => (
                              <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                sx={{ position: 'relative', minHeight: '520px' }}
                                key={publicLogo}
                              >
                                <Box sx={{ position: 'relative', height: '335px', width: '100vw' }}>
                                  <Image
                                    src={`https://storage.googleapis.com/explomaker-data-stateless/${encodeURI(
                                      photo.src.original
                                    )}`}
                                    quality={100}
                                    className={classes.mobileAdaptedProject}
                                    alt="publicPresentation_image"
                                    fill
                                    sizes="100vw"
                                    style={{
                                      objectFit: 'cover',
                                    }}
                                  />
                                </Box>
                                <Paper elevation={2} className={classes.travelTilePaper}>
                                  <Box marginBottom="15px">
                                    <Typography
                                      variant="h5"
                                      className={clsx({
                                        [classes.rotate35Deg]: titre === 'Entre amis',
                                      })}
                                    >
                                      {publicLogo}
                                    </Typography>
                                  </Box>
                                  <Box marginBottom="10px">
                                    <Typography variant="h6">{titre}</Typography>
                                  </Box>
                                  <Typography className={classes.textCenter}>{texte}</Typography>
                                </Paper>
                              </Box>
                            )
                          )}
                      </Carousel>
                    </Box>
                  ) : (
                    /* Desktop ver */
                    <>
                      <Box sx={{ width: '1140px' }}>
                        <Carousel
                          navButtonsAlwaysInvisible
                          animation="slide"
                          indicators={false}
                          index={currentSlideDesktopPart6}
                          onChange={currentIndex => setCurrentSlideDesktopPart6(currentIndex)}
                          autoPlay={false}
                        >
                          {photosSliderArguments?.elements &&
                            photosSliderArguments.elements.map(({ photo }) => (
                              <Box sx={{ position: 'relative' }} key={photo.src.original}>
                                <Image
                                  src={`https://storage.googleapis.com/explomaker-data-stateless/${encodeURI(
                                    photo.src.original
                                  )}`}
                                  width={1140}
                                  height={477}
                                  quality={100}
                                  className={classes.travelBoxImage}
                                  alt="travelBox_image"
                                  style={{
                                    maxWidth: '100%',
                                    height: 'auto',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                  }}
                                />
                              </Box>
                            ))}
                        </Carousel>
                      </Box>
                      <Box display="flex" justifyContent="space-evenly">
                        {photosSliderArguments?.elements &&
                          photosSliderArguments.elements.map(
                            ({ logo: publicLogo, titre, texte }, index) => (
                              <Paper
                                key={titre}
                                elevation={2}
                                className={clsx(
                                  classes.travelTilePaper,
                                  classes.travelTileDesktopPaper,
                                  {
                                    [classes.activeTravelTile]: currentSlideDesktopPart6 === index,
                                  }
                                )}
                                component={ButtonBase}
                                onClick={() => setCurrentSlideDesktopPart6(index)}
                              >
                                <Box marginBottom="15px">
                                  <Typography
                                    variant="h5"
                                    className={clsx({
                                      [classes.rotate35Deg]: titre === 'Entre amis',
                                    })}
                                  >
                                    {publicLogo}
                                  </Typography>
                                </Box>
                                <Box marginBottom="10px">
                                  <Typography variant="h6">{titre}</Typography>
                                </Box>
                                <Typography className={classes.textCenter}>{texte}</Typography>
                              </Paper>
                            )
                          )}
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        {/* Fin de partie 6 */}
        {/* Partie 11 */}
        <Box className={classes.greyBackgroundContainer}>
          <Box className={classes.mainContainer}>
            <Box className={classes.destinationBox} padding="60px 0">
              <Box display="flex" flexDirection="column" alignItems="center">
                <Box marginBottom="20px" className={classes.mobileSizing}>
                  <Typography
                    variant="subtitle1"
                    className={clsx(classes.mobileSubtitle, classes.ultraDark)}
                  >
                    {articlesSelection?.sur_titre}
                  </Typography>
                </Box>
                <Box marginBottom="50px" className={classes.mobileSizing}>
                  <Typography
                    variant="h1"
                    component="h2"
                    className={clsx(classes.mobileTextCenter, classes.mobileTitle)}
                  >
                    {articlesSelection?.titre}
                  </Typography>
                </Box>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignSelf="stretch"
                marginBottom="50px"
                flexWrap="wrap"
                className={classes.mobileAlignCenter}
                sx={{ [theme.breakpoints.down('sm')]: { gridGap: '15px' } }}
              >
                {articlesSelection?.elements.length > 0 &&
                  articlesSelection?.elements.map(
                    (
                      {
                        title,
                        sub_type: subType,
                        picture,
                        creation_date: creationDate,
                        reading_time: readingTime,
                        target_url: targetURL,
                      },
                      index
                    ) => (
                      <Box marginBottom={matchesXs && '30px'}>
                        <MobileBlogCard
                          title={title.substring(0, 89)}
                          category={subType ? subType[0].name : 'Demacia'}
                          srcImg={`https://storage.googleapis.com/explomaker-data-stateless/${encodeURI(
                            picture.src.original
                          )}`}
                          publishDate={creationDate}
                          readingTime={readingTime}
                          altImg={`image de la blogCard${index}`}
                          is360px
                          targetLink={targetURL}
                        />
                      </Box>
                    )
                  )}
              </Box>
              <Link
                passHref
                href="/exploration?SearchFront%5BrefinementList%5D%5Bavis_explomaker%5D%5B0%5D=Nos%20coups%20de%20coeur"
                target="_blank"
                className={classes.nextLink}
              >
                <Button
                  variant="contained"
                  className={clsx(classes.buttonPrimary)}
                  sx={{ minWidth: '250px' }}
                >
                  Tous les articles
                </Button>
              </Link>
            </Box>
          </Box>
        </Box>
        {/* Fin de la partie 11 */}
      </Box>
    </>
  )
}
export default WelcomePage
