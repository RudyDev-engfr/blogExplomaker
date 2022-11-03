import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Rating from '@mui/material/Rating'
import TextField from '@mui/material/TextField'
import useMediaQuery from '@mui/material/useMediaQuery'
import { FormControl, FormLabel, InputLabel, useTheme } from '@mui/material'
import ButtonBase from '@mui/material/ButtonBase'
import makeStyles from '@mui/styles/makeStyles'
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet'
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
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import Poll from '@mui/icons-material/Poll'
import RestaurantMenu from '@mui/icons-material/RestaurantMenu'
import clsx from 'clsx'
import Carousel from 'react-material-ui-carousel'
import 'react-multi-carousel/lib/styles.css'
import ReactPlayer from 'react-player/lazy'
import { format, parse } from 'date-fns'

import BlogCard from '../components/molecules/BlogCard'
import SpotCard from '../components/SpotCard'
import { database } from '../lib/firebase'
import GoTopBtn from '../components/GoTopBtn'
import TrendingDestinations from '../components/molecules/TrendingDestinations'

import logoFull from '../images/icons/logoFull.svg'
import concept2 from '../images/concept2.png'
import illustrationComplete from '../images/ILLUSTRATION_COMPLETE.png'
import illustrationPlanning from '../images/ILLUSTRATION_PLANNING_1.png'
import illustrationCollab from '../images/ILLUSTRATION_COLLAB.png'
import travelPicture from '../images/travelTile.png'
import emma from '../images/emma.png'
import logo from '../images/icons/logo.svg'
import MobileBlogCard from '../components/molecules/MobileBlogCard'

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
    text: 'Créé ton planning, jour par jour et heure par heure. Sur place, consulte-le, puis accède aux détails de chaque événement.',
  },
  {
    Icon: Explore,
    label: 'Exploration',
    text: 'Avant comme pendant le voyage, explore les alentours pour trouver un restaurant, une activité ou un hébergement.',
  },
  {
    Icon: EmojiObjects,
    label: 'Inspiration',
    text: 'En manque d’inspi ? On te propose des articles et des fiches destinations en lien avec le lieu de ton séjour.',
  },
  // {
  //   Icon: AccountBalanceWallet,
  //   label: 'Documents',
  //   text: 'Centralise et/ou partage des documents et des notes pour tout avoir sous la main et être prêt le jour J.',
  // },
]

const itemsCollaborate = [
  {
    Icon: ChatBubble,
    label: 'Chat de groupe',
    text: 'Un chat uniquement dédié à ton prochain séjour.',
  },
  {
    Icon: Poll,
    label: 'Sondages',
    text: 'Créez des sondages et votez pour vos options préférées.',
  },
  {
    Icon: Favorite,
    label: 'Collecte des envies',
    text: 'Indiquez chacun vos envies personnelles et créez le voyage qui plaira à tous.',
  },
  // {
  //   Icon: PhotoCamera,
  //   label: 'Partage de photos',
  //   text: 'Centralisez toutes vos photos prises lors du séjour.',
  // },
]

const workingItem = [
  {
    emoji: '🔍',
    label: 'Avant : ',
    coloredLabel: 'Préparez',
    text: 'Psychopathes de l’organisation, \n ou partisans du freestyle, Explomaker saura vous fournir le dégré d’accompagnement que vous souhaitez pour la préparation de votre séjour.',
  },
  {
    emoji: '🧭',
    label: 'Pendant : ',
    coloredLabel: 'Explorez',
    text: 'Consultez votre planning, déplacez vous facilement, accèdez à tous vos documents (billets, réservations...), explorez les alentours, et communiquez entre vous lorsque vous êtes séparés.',
  },
  {
    emoji: '📷',
    label: 'Après : ',
    coloredLabel: 'Partagez',
    text: 'Créez des albums photos, privés oupartagés, et ajoutez-y vos photos de voyage pour pouvoir les commenter, les télécharger et vous remémorer de bons souvenirs, entre vous, de manière sécurisée.',
  },
]

const useStyles = makeStyles(theme => ({
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
    width: '23px',
    height: '23px',
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
    '&:hover': {
      bottom: '180px',
      transition: 'all 0.3s',
    },
    [theme.breakpoints.down('sm')]: {
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
      'linear-gradient(180deg, rgba(230, 245, 244, 0.8) 0%, rgba(230, 245, 244, 0.2) 100%)',
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
      'linear-gradient(180deg, rgba(230, 245, 244, 0.8) 0%, rgba(230, 245, 244, 0.2) 100%)',
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
    },
  },
  destinationBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '70px',
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
      maxWidth: '235px',
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
      maxWidth: '84%',
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
      maxHeight: '300px',
      borderRadius: '0',
    },
  },
  mobileAdaptedProject: {
    minHeight: '335px',
  },
}))

export async function getStaticProps() {
  const doc = await database.ref().child('page_structure/accueil').get()
  let dataset
  if (doc.exists()) {
    dataset = doc.val()
  }

  return {
    props: { dataset },
    revalidate: 5000,
  }
}

const Home = ({ dataset }) => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const {
    hotArticles,
    reviews,
    heartStrokes,
    trendingDestinations,
    trendingSpot,
    publicPresentation,
  } = dataset

  const [email, setEmail] = useState('')
  const [currentSlideDesktopPart6, setCurrentSlideDesktopPart6] = useState(0)
  const [currentSlideSpot, setCurrentSlideSpot] = useState(0)
  const [trendingDestinationsItems, setTrendingDestinationsItems] = useState([])
  const [currentPublicPresentation, setCurrentPublicPresentation] = useState([])
  const [currentHeartStrokes, setCurrentHeartStrokes] = useState([])
  const [showGoTop, setShowGoTop] = useState()
  const refScrollUp = useRef(null)

  useEffect(() => {
    const trendingDestinationsKeys = Object.keys(trendingDestinations)
    const tempTrendingDestinationsArray = trendingDestinationsKeys.map(
      currentKey => trendingDestinations[currentKey]
    )
    setTrendingDestinationsItems(tempTrendingDestinationsArray)
  }, [trendingDestinations])

  useEffect(() => {
    if (typeof heartStrokes !== 'undefined') {
      const heartStrokesKeys = Object.keys(heartStrokes)
      const tempHeartStrokes = heartStrokesKeys.map(currentKey => heartStrokes[currentKey])
      setCurrentHeartStrokes(tempHeartStrokes)
    }
  }, [heartStrokes])

  useEffect(() => {
    const publicPresentationKeys = Object.keys(publicPresentation)
    const tempPublicPresentation = publicPresentationKeys.map(
      currentKey => publicPresentation[currentKey]
    )
    setCurrentPublicPresentation(tempPublicPresentation)
  }, [publicPresentation])

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

  const travelBox = [
    {
      srcImg: `https://storage.googleapis.com/stateless-www-explomaker-fr/${dataset.publicPresentation.groupe_01.photo.src.original}`,
    },
    {
      srcImg: `https://storage.googleapis.com/stateless-www-explomaker-fr/${dataset.publicPresentation.groupe_02.photo.src.original}`,
    },
    {
      srcImg: `https://storage.googleapis.com/stateless-www-explomaker-fr/${dataset.publicPresentation.groupe_03.photo.src.original}`,
    },
    {
      srcImg: `https://storage.googleapis.com/stateless-www-explomaker-fr/${dataset.publicPresentation.groupe_04.photo.src.original}`,
    },
  ]

  return (
    <>
      <Box ref={refScrollUp} />
      {!matchesXs && (
        <GoTopBtn
          show={showGoTop}
          scrollUp={() => refScrollUp.current.scrollIntoView({ behavior: 'smooth' })}
        />
      )}
      <Box className={classes.fullWidthContainer}>
        <Box className={classes.greenBackgroundContainer}>
          <Box className={classes.mainContainer}>
            {matchesXs && (
              <Box display="flex" justifyContent="center" position="relative" top="65px">
                <Image src={logoFull} width={250} height={60} />
              </Box>
            )}
            <Box
              display="flex"
              className={classes.secondaryContainer}
              marginTop="120px"
              marginBottom="130px"
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
                  <Typography variant="h1" className={classes.mobileTextCenter}>
                    L&rsquo;application qui{' '}
                    <Box component="span" className={classes.textPrimary}>
                      simplifie la préparation
                    </Box>{' '}
                    de vos futurs voyages
                  </Typography>
                </Box>
                <Box marginBottom="40px">
                  <Typography variant="body1" className={classes.mobileTextCenter}>
                    Simple, pratique et entièrement gratuit, Explomaker est un outil collaboratif
                    complet qui t’accompagne avant, pendant et après ton séjour.
                  </Typography>
                </Box>
                <Box>
                  <Box
                    marginBottom="20px"
                    sx={{
                      [theme.breakpoints.down('sm')]: { display: 'flex', justifyContent: 'center' },
                    }}
                  >
                    <Link href="https://app.explomaker.fr" passHref>
                      <Button
                        variant="contained"
                        className={clsx(classes.buttonPrimary, classes.v5MuiBUttonFix)}
                        fullWidth={!matchesXs}
                      >
                        Crée ton séjour
                      </Button>
                    </Link>
                  </Box>
                  <Box display="flex" justifyContent="space-evenly" flexWrap="wrap">
                    <Box display="flex" alignItems="center">
                      <Check color="primary" />
                      <Typography>Complet</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Check color="primary" />
                      <Typography>Collaboratif</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Check color="primary" className={classes.checkIcons} />
                      <Typography>Entièrement gratuit</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box position="relative" width="570px">
                <Box position="absolute" top="0" left="0">
                  <Box className={classes.videosGrid}>
                    <Box className="video1">
                      <ReactPlayer
                        url="https://firebasestorage.googleapis.com/v0/b/explomaker-3010b.appspot.com/o/blog%2FlandingPage%2FLEFT01.mp4?alt=media&token=406b2fd3-4a22-45d2-91b4-d0abda27e853"
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
                        url="https://firebasestorage.googleapis.com/v0/b/explomaker-3010b.appspot.com/o/blog%2FlandingPage%2FCENTER01.mp4?alt=media&token=6199c367-1476-449d-8423-03e925a7f36e"
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
                        url="https://firebasestorage.googleapis.com/v0/b/explomaker-3010b.appspot.com/o/blog%2FlandingPage%2FRIGHT01.mp4?alt=media&token=aa43aac8-1485-4a49-827b-1fe2b6b87383"
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
                        url="https://firebasestorage.googleapis.com/v0/b/explomaker-3010b.appspot.com/o/blog%2FlandingPage%2FLEFT02.mp4?alt=media&token=699ea778-4977-4b6c-8f6d-25a329ec8f05"
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
                        url="https://firebasestorage.googleapis.com/v0/b/explomaker-3010b.appspot.com/o/blog%2FlandingPage%2FCENTER02.mp4?alt=media&token=cfaccff1-8b78-40b9-847c-754c29e62526"
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
                        url="https://firebasestorage.googleapis.com/v0/b/explomaker-3010b.appspot.com/o/blog%2FlandingPage%2FRIGHT02.mp4?alt=media&token=2f842d32-fc45-41cf-8d49-b4f69afa7148"
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
                        url="https://firebasestorage.googleapis.com/v0/b/explomaker-3010b.appspot.com/o/blog%2FlandingPage%2FCENTER03.mp4?alt=media&token=16c3b6c9-47c3-40bf-9800-f36d5a8a7d69"
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
                        url="https://firebasestorage.googleapis.com/v0/b/explomaker-3010b.appspot.com/o/blog%2FlandingPage%2FRIGHT03.mp4?alt=media&token=4b0693ac-6f58-4d82-b6af-68e014ffe556"
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
        {/* Partie 2  */}
        <Box className={classes.whiteBackgroundContainer}>
          <Box className={classes.mainContainer}>
            <Box
              className={clsx(classes.mobileFlexWrapReverse, classes.page2)}
              display="flex"
              justifyContent="center"
              marginTop="150px"
              marginBottom="150px"
            >
              <Image src={illustrationComplete} width="540" quality={100} />
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
                    Un voyage ? Explomaker !
                  </Typography>
                </Box>
                <Box marginBottom="20px">
                  <Typography
                    variant="h1"
                    component="h2"
                    className={clsx(classes.mobileTextCenter, classes.mobileTitle)}
                  >
                    Le nouveau compagnon de tes futurs voyages
                  </Typography>
                </Box>
                <Box marginBottom="40px">
                  <Typography variant="body1" className={classes.mobileTextCenter}>
                    Tu utilises une dizaine d’applications pour préparer tes voyages ? Avec
                    ExploMaker, c’est terminé ! Retrouve tout ce dont tu as besoin au sein d’une
                    seule et même interface.
                  </Typography>
                </Box>
                <Link href="https://app.explomaker.fr" passHref>
                  <Button
                    variant="contained"
                    className={clsx(
                      classes.buttonPrimary,
                      classes.mediumSize,
                      classes.v5MuiBUttonFix
                    )}
                  >
                    Crée ton séjour
                  </Button>
                </Link>
              </Box>
            </Box>
          </Box>
        </Box>
        {/* Partie 3 */}
        <Box className={classes.whiteBackgroundContainer}>
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
                      Un outil de plannification complet
                    </Typography>
                  </Box>
                  <Box marginBottom="20px">
                    <Typography
                      variant="h1"
                      component="h2"
                      className={clsx(classes.mobileTextCenter, classes.mobileTitle)}
                    >
                      Tu aimes que tout soit carré? Bienvenue 🤝
                    </Typography>
                  </Box>
                  <Box marginBottom="50px">
                    <Typography variant="body1" className={classes.mobileTextCenter}>
                      Ajoute hébergements, activités, restaurants, transports sur place et vols à
                      ton planning. Des envies différentes ? Chacun son planning ! Ajoute tes
                      partenaires de voyage uniquement aux événements qui les concernent.
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
                  <Box position="relative">
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
              <Image src={illustrationPlanning} width="537" quality={100} />
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
                  >
                    La préparation de voyage simplifiée
                  </Typography>
                </Box>
                <Typography
                  variant="h1"
                  component="h2"
                  className={clsx(classes.mobileTextCenter, classes.mobileTitle)}
                >
                  Tout ce qu&rsquo;il faut pour préparer ton séjour
                </Typography>
              </Box>
              <Box className={classes.preparingBox}>
                {matchesXs ? (
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
                    {itemsPreparation.map(({ Icon, label, text }) => (
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
                          {text}
                        </Typography>
                      </Box>
                    ))}
                  </Carousel>
                ) : (
                  itemsPreparation.map(({ Icon, label, text }) => (
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                      maxWidth="255px"
                      mx={2.5}
                      key={label}
                    >
                      <Box className={classes.preparationBackground}>
                        <Icon className={classes.preparationIcon} />
                      </Box>
                      <Box marginBottom="10px">
                        <Typography variant="h6">{label}</Typography>
                      </Box>
                      <Typography variant="body1" className={classes.preparationText}>
                        {text}
                      </Typography>
                    </Box>
                  ))
                )}
              </Box>
            </Box>
          </Box>
        </Box>
        {/* Fin de la partie 4 */}
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
              <Image src={illustrationCollab} width="562" quality={100} />
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
                    Un outil collaboratif
                  </Typography>
                </Box>
                <Box marginBottom="50px">
                  <Typography
                    variant="h1"
                    component="h2"
                    className={clsx(classes.mobileTextCenter, classes.mobileTitle)}
                  >
                    Construisez ensemble le séjour de vos rêves 🙌
                  </Typography>
                </Box>
                <Box className={classes.collaborationBox}>
                  {itemsCollaborate.map(({ Icon, label, text }) => (
                    <Box display="flex" alignItems="center" key={label} marginBottom="40px">
                      <Box className={classes.collaborationBackground}>
                        <Icon className={classes.collaborationIcon} />
                      </Box>
                      <Box className={classes.argumentItem}>
                        <Typography variant="h6">{label}</Typography>
                        <Typography variant="body1" className={classes.collaborationText}>
                          {text}
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
                      {currentPublicPresentation.map(
                        ({ logo: publicLogo, titre, texte, photo }) => (
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            position="relative"
                            key={publicLogo}
                            minHeight="335px"
                          >
                            <Image
                              src={
                                `https://storage.googleapis.com/stateless-www-explomaker-fr/${encodeURI(
                                  photo.src.original
                                )}` ?? travelPicture
                              }
                              width={500}
                              objectFit="cover"
                              height={335}
                              quality={100}
                              className={classes.mobileAdaptedProject}
                            />
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
                  ) : (
                    /* Desktop ver */
                    <>
                      <Carousel
                        navButtonsAlwaysInvisible
                        animation="slide"
                        indicators={false}
                        index={currentSlideDesktopPart6}
                        onChange={currentIndex => setCurrentSlideDesktopPart6(currentIndex)}
                      >
                        {travelBox.map(({ srcImg }) => (
                          <Box position="relative" key={srcImg}>
                            <Image
                              src={encodeURI(srcImg)}
                              width={1140}
                              height={477}
                              objectFit="cover"
                              objectPosition="center"
                              quality={100}
                              className={classes.travelBoxImage}
                            />
                          </Box>
                        ))}
                      </Carousel>
                      <Box display="flex" justifyContent="space-evenly">
                        {currentPublicPresentation.map(
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
                    Ton voyage, de A à Z !
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
                    Comment ça marche ?
                  </Typography>
                </Box>
                <Box className={classes.workingBox}>
                  {workingItem.map(({ emoji, label, coloredLabel, text }, index) => (
                    <Box display="flex" flexDirection="column" alignItems="center" key={label}>
                      <Box marginBottom="25px">
                        <Typography className={classes.workingEmoji}>{emoji}</Typography>
                      </Box>
                      <Box marginBottom="10px">
                        <Typography variant="h6">
                          {label}
                          <Box component="span" className={classes.textPrimary}>
                            {coloredLabel}
                          </Box>
                        </Typography>
                      </Box>
                      <Typography variant="body1" className={classes.preparationText}>
                        {index === 0 ? text : text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Link href="https://app.explomaker.fr" passHref>
                  <Button
                    variant="contained"
                    className={clsx(
                      classes.buttonPrimary,
                      classes.smallSize,
                      classes.mobileButton,
                      classes.v5MuiBUttonFix
                    )}
                  >
                    Crée ton séjour
                  </Button>
                </Link>
              </Box>
            </Box>
          </Box>
        </Box>
        {/* Fin de partie 7 */}
        {/* Partie 8 */}
        <Box className={classes.whiteBackgroundContainer}>
          <Box className={classes.mainContainer}>
            <Box
              display="flex"
              flexDirection="column"
              marginBottom="140px"
              className={classes.mobileAlignCenter}
            >
              <Box
                marginBottom="50px"
                className={clsx(classes.mobileFlexColumn, classes.mobileAlignCenter)}
              >
                <Box marginBottom="20px" className={classes.mobileSizing}>
                  <Typography
                    variant="subtitle1"
                    className={clsx(
                      classes.mobileSubtitle,
                      classes.mobileTextCenter,
                      classes.ultraDark
                    )}
                  >
                    L&rsquo;avis des explorateurs
                  </Typography>
                </Box>
                <Typography
                  variant="h1"
                  component="h2"
                  className={clsx(classes.mobileTitle, classes.mobileTextCenter)}
                >
                  Ils utilisent Explomaker
                </Typography>
              </Box>
              <Box className={classes.mobileSizing}>
                <Card elevation={2} className={classes.opinionCard}>
                  <CardContent>
                    <Box className={classes.opinionProfileUser}>
                      <Image
                        src={emma}
                        width="70"
                        height="70"
                        quality={100}
                        className={classes.opinionUserPicture}
                      />
                      <Box display="flex" flexDirection="column">
                        {matchesXs ? (
                          <>
                            <Typography
                              variant="h3"
                              component="h6"
                              className={clsx(classes.grey33, classes.weight500)}
                            >
                              {reviews[0].nom}
                            </Typography>
                            <Typography
                              variant="body2"
                              className={classes.colorRed}
                              sx={{ fontSize: '17px', lineHeight: '25px' }}
                            >
                              {reviews[0].sejour}
                            </Typography>
                            <Rating value={parseFloat(reviews[0].note)} readOnly />
                          </>
                        ) : (
                          <>
                            <Box display="flex" justifyContent="space-between">
                              <Typography
                                variant="h3"
                                component="h6"
                                className={clsx(classes.grey33, classes.weight500)}
                              >
                                {reviews[0].nom}
                              </Typography>
                              <Rating value={parseFloat(reviews[0].note)} readOnly />
                            </Box>
                            <Typography
                              variant="body2"
                              className={clsx(classes.colorRed, classes.weight500)}
                            >
                              {reviews[0].sejour}
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Box>
                    <Box>
                      <Typography className={classes.grey33}>{reviews[0].texte}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Box>
        </Box>
        {/* Fin de la partie 8 */}
        {/* Partie 9 */}
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
                    Le blog
                  </Typography>
                </Box>
                <Box marginBottom="50px" className={classes.mobileSizing}>
                  <Typography
                    variant="h1"
                    component="h2"
                    className={clsx(classes.mobileTitle, classes.mobileTextCenter)}
                  >
                    Articles tout chaud 🔥
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
                    bigTitle={hotArticles[0].title}
                    category={hotArticles[0].sub_type[0].name}
                    srcImg={`https://storage.googleapis.com/stateless-www-explomaker-fr/${hotArticles[0].picture.src.original}`}
                    altImg=""
                    date={hotArticles[0].creation_date}
                    readingTime={`${hotArticles[0].reading_time} min`}
                  />
                </Box>
                {/* TODO on the blog card and on the links, redirect to blog or article (?) */}
                <Paper elevation={2} className={clsx(classes.mobileSizing, classes.blogList)}>
                  {hotArticles
                    .filter((article, index) => index !== 0)
                    .map(({ title, sub_type: subType }, index, currentArray) => (
                      <Box key={`hotArticles${title}`}>
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
                        {index !== currentArray.length - 1 && (
                          <Divider className={classes.stroke} />
                        )}
                      </Box>
                    ))}
                </Paper>
              </Box>
              <Link component={IconButton} passhref href="/inspiration">
                <Button
                  variant="contained"
                  className={clsx(
                    classes.buttonPrimary,
                    classes.smallSize,
                    classes.mobileButton,
                    classes.v5MuiBUttonFix
                  )}
                >
                  Plus de lecture ?
                </Button>
              </Link>
            </Box>
          </Box>
        </Box>
        {/* Fin de la partie 9 */}
        {/* Partie 10 */}
        <Box className={classes.whiteBackgroundContainer} padding="60px 0 0 0">
          <Box className={classes.mainContainer}>
            <Box>
              <Box
                display="flex"
                alignItems="center"
                flexDirection="column"
                position="relative"
                marginBottom={matchesXs ? '0' : '150px'}
                className={clsx(classes.mobileAlignCenter, classes.mobileFlexColumn)}
              >
                <Box marginBottom="20px">
                  <Typography
                    variant="subtitle1"
                    className={clsx(classes.mobileSubtitle, classes.ultraDark)}
                  >
                    Focus
                  </Typography>
                </Box>
                <Box marginBottom="50px" className={classes.mobileSizing}>
                  <Typography
                    variant="h1"
                    component="h2"
                    className={clsx(classes.mobileTextCenter, classes.mobileTitle)}
                  >
                    Le spot du moment ✨
                  </Typography>
                </Box>
                {matchesXs ? (
                  <Box
                    display="flex"
                    alignItems="center"
                    className={clsx(classes.mobileAlignCenter, classes.mobileFlexColumn)}
                  >
                    <Box position="relative">
                      <Carousel
                        infinite={false}
                        navButtonsAlwaysInvisible
                        indicators={false}
                        animation="slide"
                      >
                        {trendingSpot[0].links.map(spot => (
                          <Box
                            key={spot.picture.src.id}
                            minWidth="100%"
                            height="300px"
                            position="relative"
                          >
                            <img
                              src={`https://storage.googleapis.com/stateless-www-explomaker-fr/${encodeURI(
                                spot.picture.src.original
                              )}`}
                              alt=""
                              className={classes.focusImg}
                            />
                            {/* <LinearProgress variant="determinate" value="0" /> */}
                            <Box className={classes.logoSpot}>
                              <Image src={logo} width="169" height="209" quality={100} />
                            </Box>
                          </Box>
                        ))}
                      </Carousel>
                    </Box>
                    <SpotCard data={trendingSpot[0]} />
                  </Box>
                ) : (
                  /* Desktop ver */
                  <Box display="flex" alignSelf="flex-start" flexDirection="column">
                    <Box position="relative">
                      <Box className={classes.buttonsSpot}>
                        <Button
                          className={classes.carouselArrow}
                          onClick={() => {
                            let previousIndex
                            if (currentSlideSpot > 0) {
                              previousIndex = currentSlideSpot - 1
                            } else {
                              previousIndex = trendingSpot[0].links.length - 1
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
                              currentSlideSpot < trendingSpot[0].links.length - 1
                                ? currentSlideSpot + 1
                                : 0
                            )
                          }
                        >
                          <ArrowRightAlt fontSize="large" />
                        </Button>
                      </Box>
                      <Carousel
                        indicators={false}
                        navButtonsAlwaysInvisible
                        animation="slide"
                        index={currentSlideSpot}
                        onChange={currentIndex => setCurrentSlideSpot(currentIndex)}
                      >
                        {trendingSpot[0].links.map(spot => (
                          <Box key={spot.picture.src.id} width="810px" height="580px">
                            <img
                              src={`https://storage.googleapis.com/stateless-www-explomaker-fr/${encodeURI(
                                spot.picture.src.original
                              )}`}
                              alt=""
                              className={classes.focusImg}
                            />
                            <Box className={classes.logoSpot}>
                              <Image src={logo} width="169" height="209" quality={100} />
                            </Box>
                            {/* <LinearProgress variant="determinate" value="0" /> */}
                          </Box>
                        ))}
                      </Carousel>
                    </Box>
                    <SpotCard data={trendingSpot[0]} />
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
        {/* Fin de la partie 10 */}
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
                    Articles
                  </Typography>
                </Box>
                <Box marginBottom="50px" className={classes.mobileSizing}>
                  <Typography
                    variant="h1"
                    component="h2"
                    className={clsx(classes.mobileTextCenter, classes.mobileTitle)}
                  >
                    Nos coups de cœur 💫
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
              >
                {currentHeartStrokes.length > 0 &&
                  currentHeartStrokes.map(
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
                          srcImg={`https://storage.googleapis.com/stateless-www-explomaker-fr/${encodeURI(
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
                href="/results?SearchFront%5BrefinementList%5D%5Bavis_explomaker%5D%5B0%5D=Nos%20coups%20de%20coeur"
              >
                <Button
                  variant="contained"
                  className={clsx(classes.buttonPrimary, classes.smallSize, classes.mobileButton)}
                >
                  Tous les articles
                </Button>
              </Link>
            </Box>
          </Box>
        </Box>
        {/* Fin de la partie 11 */}
        {/* Partie 12 */}
        <Box
          className={classes.whiteBackgroundContainer}
          sx={{ marginBottom: matchesXs ? '130px' : '80px' }}
        >
          <Box className={classes.mainContainer}>
            <TrendingDestinations
              trendingDestinationsItems={trendingDestinationsItems}
              dotListClass={classes.customTrendingDestinationsDotBox}
            />
          </Box>
        </Box>
        {/* Fin de partie 12 */}
        {/* Partie 13 */}
        <Box
          className={
            !matchesXs ? classes.whiteBackgroundContainer : classes.greyBackgroundContainer
          }
        >
          <Box className={classes.mainContainer}>
            {matchesXs ? (
              <Box display="flex" justifyContent="center" position="relative">
                <Box className={classes.paperNewsletter}>
                  <Box alignSelf="stretch" className={classes.shadowBoxNewsletter} />
                  <Box marginBottom="20px">
                    <Typography
                      variant="subtitle1"
                      className={clsx(classes.mobileSubtitle, classes.ultraDark)}
                    >
                      ExploLetter
                    </Typography>
                  </Box>
                  <Box maxWidth="500px" marginBottom="20px">
                    <Typography
                      variant="h5"
                      component="h2"
                      className={clsx(classes.mobileSmallTitle, classes.textCenter)}
                    >
                      La newsletter des grands voyageurs
                      <Box
                        component="span"
                        className={clsx(classes.fs34, classes.mobileSmallTitle)}
                      >
                        🧭
                      </Box>
                    </Typography>
                  </Box>
                  <Box maxWidth="470px" className={classes.textCenter} marginBottom="40px">
                    <Typography>
                      Inspiration, bon plans et destinations du moment, une seule fois par semaine,
                      c&rsquo;est promis !
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" className={classes.mobileFlexColumn}>
                    <Box>
                      <FormControl>
                        <TextField
                          id="email"
                          type="email"
                          label="Adresse email"
                          margin="dense"
                          InputProps={{
                            classes: { root: classes.inputNewsletter },
                          }}
                        />
                        <FormLabel sx={{ color: 'red !important' }} />
                      </FormControl>
                    </Box>
                    <Button
                      variant="contained"
                      className={clsx(classes.buttonNewsletter, classes.v5MuiBUttonFix)}
                    >
                      Je m&rsquo;inscris
                    </Button>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box display="flex" justifyContent="center" position="relative">
                <Paper elevation={8} className={classes.paperNewsletter}>
                  <Box alignSelf="stretch" className={classes.shadowBoxNewsletter} />
                  <Box marginBottom="20px">
                    <Typography variant="subtitle1" className={classes.ultraDark}>
                      ExploLetter
                    </Typography>
                  </Box>
                  <Box maxWidth="500px" marginBottom="20px">
                    <Typography
                      variant="h1"
                      component="h2"
                      className={clsx(classes.mobileSmallTitle, classes.textCenter)}
                    >
                      La newsletter <br /> des grands voyageurs{' '}
                      <Box component="span" className={classes.fs34}>
                        🧭
                      </Box>
                    </Typography>
                  </Box>
                  <Box maxWidth="470px" className={classes.textCenter} marginBottom="40px">
                    <Typography>
                      Inspiration, bon plans et destinations du moment, une seule fois par semaine,
                      c&rsquo;est promis !
                    </Typography>
                  </Box>
                  <form
                    onSubmit={event => {
                      event.preventDefault()
                      console.log(email)
                    }}
                    className={clsx(classes.formNewsletter, classes.mobileFlexColumn)}
                  >
                    <Box marginRight="15px">
                      <TextField
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        id="email"
                        type="email"
                        label="Adresse email"
                        variant="filled"
                        margin="dense"
                        InputProps={{
                          classes: { root: classes.inputNewsletter },
                          disableUnderline: true,
                        }}
                      />
                    </Box>
                    <Button variant="contained" type="submit" className={classes.buttonNewsletter}>
                      Je m&rsquo;inscris
                    </Button>
                  </form>
                </Paper>
              </Box>
            )}
          </Box>
        </Box>
        {/* Fin de la partie 13 */}
      </Box>
    </>
  )
}

export default Home
