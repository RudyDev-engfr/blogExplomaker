import { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import makeStyles from '@mui/styles/makeStyles'
import AccountBox from '@mui/icons-material/AccountBox'
import AvTimer from '@mui/icons-material/AvTimer'
import Money from '@mui/icons-material/Money'
import Language from '@mui/icons-material/Language'
import ArrowRightAlt from '@mui/icons-material/ArrowRightAlt'
import PinDropOutlined from '@mui/icons-material/PinDropOutlined'
import CameraAltOutlined from '@mui/icons-material/CameraAltOutlined'
// import { Marker } from '@react-google-maps/api'
import clsx from 'clsx'
import Carousel from 'react-material-ui-carousel'
import MultiCarousel from 'react-multi-carousel'
import Image from 'next/image'
import { v4 as uuidv4 } from 'uuid'
import 'react-multi-carousel/lib/styles.css'

import BlogCard from '../../components/molecules/BlogCard'
import GoTopBtn from '../../components/GoTopBtn'
import IndicatorBox from '../../components/atoms/IndicatorBox'
// import Map from '../../components/Map'
import { database } from '../../lib/firebase'

import MobileBlogCard from '../../components/molecules/MobileBlogCard'
import blogPicture from '../../images/blogCardPicture.png'
import blogPicture2 from '../../images/blogCardPicture2.png'
import blogPicture3 from '../../images/blogCardPicture3.png'
import planningImg from '../../images/ILLUSTRATION_PLANNING_1.png'
import ButtonLike from '../../components/atoms/ButtonLike'
import Head from '../../components/molecules/Head'
import TrendingDestinations from '../../components/molecules/TrendingDestinations'
import BackButton from '../../components/atoms/BackButton'
import TrendingDestinationsDotBox from '../../components/multi-carousel/TrendingDestinationsDotBox'
import TrendingDestinationsGroupButton from '../../components/multi-carousel/TrendingDestinationsGroupButton'
import ButtonBookmark from '../../components/atoms/ButtonBookmark'

const useStyles = makeStyles(theme => ({
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
  mobileBlogCardContainer: {
    backgroundColor: theme.palette.grey.f2,
    padding: '100px 0 50px 30px',
  },
  headingPaper: {
    padding: '30px 70px 30px 60px',
    position: 'relative',
    borderRadius: '40px 40px 0 0',
    [theme.breakpoints.down('sm')]: {
      padding: '25px 10px 30px',
    },
  },
  spotTitle: {
    textTransform: 'capitalize',
    fontSize: '72px',
    lineHeight: '137px',
    textAlign: 'center',
    fontWeight: '700',
    color: '#000000',
    [theme.breakpoints.down('sm')]: {
      fontSize: '38px',
      lineHeight: '43px',
      marginBottom: '10px',
    },
  },
  spotSubtitle: {
    maxWidth: '80%',
    margin: 'auto',
    textAlign: 'center',
    fontSize: '24px',
    lineHeight: '30px',
    fontWeight: '500',
    marginBottom: '60px',
    fontFamily: theme.typography.fontFamily,
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '24px',
      textAlign: 'center',
      marginBottom: '30px',
    },
  },
  ultraDark: {
    color: theme.palette.primary.ultraDark,
  },
  boxCTA: {
    backgroundColor: theme.palette.grey.f7,
    width: 'calc(100% - 450px)',
    position: 'relative',
    left: '450px',
    borderRadius: '20px',
  },
  mobileBoxCTA: {
    width: '90%',
    margin: 'auto',
    position: 'relative',
    borderRadius: '20px',
    backgroundColor: theme.palette.grey.f7,
  },
  boxCTATitle: {
    fontSize: '28px',
    lineHeiht: '34px',
    fontWeight: '500',
  },
  boxCTAText: {
    color: theme.palette.grey['4f'],
  },
  boxCTAButton: {
    textTransform: 'none',
    width: '35%',
    padding: '18.5px 22px',
    borderRadius: '50px',
    fontSize: '18px',
    lineHeight: '21px',
    [theme.breakpoints.down('sm')]: {
      width: '70%',
    },
  },
  flagRound: {
    width: '80px',
    height: '80px',
    borderRadius: '50px',
    backgroundColor: theme.palette.secondary.contrastText,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '20px',
  },
  flagRoundFlag: {
    fontSize: '40px',
  },
  flagSquared: {
    width: '50px',
    height: '50px',
    borderRadius: '10px',
    position: 'absolute',
    top: '185px',
    left: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.secondary.contrastText,
  },
  flagSquaredFlag: {
    fontSize: '32px',
  },
  fewWordsTitle: {
    fontSize: '28px',
    lineHeight: '32px',
    fontWeight: '700',
    marginBottom: '10px',
    fontFamily: theme.typography.fontFamily,
  },
  countryAsideTitle: {
    fontSize: '28px',
    lineHeight: '32px',
    fontWeight: '700',
    fontFamily: theme.palette.titleFontFamily,
    color: theme.palette.secondary.contrastText,
  },
  practicalInfo: {
    fontSize: '24px',
    lineHeight: '30px',
    fontWeight: '500',
    fontFamily: theme.typography.fontFamily,
    marginBottom: '25px',
  },
  greenLabel: {
    color: theme.palette.primary.main,
    lineHeight: '27px',
  },
  smallInfoTextStyle: {
    fontSize: '14px',
    lineHeight: '24px',
    fontWeight: '400',
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px',
      lineHeight: '24px',
    },
  },
  verySmallTextStyle: {
    color: 'rgba(0,0,0,0.5)',
    fontSize: '11px',
    lineHeight: '24px',
  },
  bestPeriodBox: {
    width: '50px',
    display: 'flex',
    flexDirection: 'column',
  },
  timeline: {
    height: '20px',
    maxWidth: '50px',
    [theme.breakpoints.down('sm')]: {
      width: '50px',
    },
  },
  perfectTimeline: {
    backgroundColor: theme.palette.primary.main,
  },
  correctTimeline: {
    backgroundColor: theme.palette.primary.main,
    opacity: '0.6',
  },
  notRecommandedTimeline: {
    backgroundColor: theme.palette.grey.df,
    opacity: '0.5',
  },
  timelineStart: {
    borderRadius: '18px 0 0 18px',
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  timelineEnd: {
    borderRadius: '0 18px 18px 0',
  },
  timelineMonth: {
    alignSelf: 'center',
    fontSize: '14px',
    lineHeight: '24px',
    fontWeight: '400',
    textTransform: 'lowercase',
    [theme.breakpoints.down('sm')]: {
      padding: '9px 15px 20px 15px',
    },
  },
  countryAside: {
    maxWidth: '370px',
    minHeight: '600px',
    backgroundColor: theme.palette.primary.ultraDark,
    color: 'white',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    padding: '20px',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
      width: '100%',
      alignSelf: 'center',
    },
  },
  mobileCountryAside: {
    width: '90%',
    minWidth: '315px',
    height: 'auto',
    minHeight: '350px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: theme.palette.primary.ultraLight,
    borderRadius: '20px',
    position: 'relative',
    marginBottom: '50px',
  },
  mobileCountryAsideTitle: {
    fontSize: '20px',
    lineHeight: '24px',
    fontWeight: '500',
    paddingLeft: '20px',
  },
  bestPeriodContainer: {
    padding: '30px 0 0 50px',
    position: 'relative',
    top: '-60px',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0',
      top: '0',
    },
  },
  interactionBox: {
    paddingLeft: '70px',
    maxWidth: '370px',
    '& > *': {
      marginRight: '30px',
    },
  },
  tagsContainer: {
    minWidth: '370px',
    [theme.breakpoints.down('sm')]: {
      alignSelf: 'center',
      justifySelf: 'center',
    },
  },
  tagRounded: {
    fontSize: '0.875rem',
    fontWeight: '500',
    display: 'inline-block',
    margin: '0 12px 12px 0',
    padding: '5px 12px',
    borderRadius: '30px',
  },
  tagColorGreen: {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.ultraLight,
  },
  tagColorRed: {
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.secondary.ultraLight,
  },
  tagColorBlue: {
    color: theme.palette.primary.ultraDark,
    backgroundColor: theme.palette.primary.lightGreenBackground,
  },
  asideLabel: {
    fontSize: '20px',
    lineHeight: '28px',
    fontWeight: '400',
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: '400',
      color: theme.palette.grey.grey33,
      fontFamily: 'Rubik',
    },
  },
  asideInfo: {
    fontSize: '22px',
    lineHeight: '28px',
    fontWeight: '700',
    position: 'absolute',
    left: '45%',
    zIndex: '2',
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px',
      color: theme.palette.primary.main,
      fontWeight: '500',
      lineHeight: '24px',
      fontFamily: 'Rubik',
    },
  },
  mapAsideContainer: {
    borderRadius: '10px',
  },
  contentInfo: {
    display: 'flex',
    flexDirection: 'column',
    padding: '30px 0 0 50px',
    [theme.breakpoints.down('sm')]: {
      padding: '30px 0 0 0',
    },
  },
  countryBottomInfo: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: '10px',
    position: 'absolute',
    width: '90%',
    bottom: '20px',
  },
  practicalInfoContainer: {
    display: 'grid',
    gridTemplate: '1fr 1fr / 1fr 1fr',
    gridGap: '20px',
    [theme.breakpoints.down('sm')]: {
      gridTemplate: '1fr 1fr 1fr 1fr / 1fr',
    },
  },
  infoBox: {
    display: 'flex',
    alignItems: 'center',
    minWidth: '45%',
  },
  infoIconBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '70px',
    height: '70px',
    marginRight: '20px',
    borderRadius: '10px',
    backgroundColor: theme.palette.grey.ultraLight,
  },
  infoIcon: {
    fontSize: '41px',
    color: theme.palette.primary.main,
  },
  secondTitle: {
    fontSize: '24px',
    fontWeight: '500',
    lineHeight: '30px',
    fontFamily: theme.typography.fontFamily,
  },
  unmissableBigTitle: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '28px',
      lineHeight: '34px',
      fontWeight: '500',
      fontFamily: 'Rubik',
    },
  },
  roundedLegendTimeline: {
    width: '20px',
    height: '20px',
    borderRadius: '50px',
    marginRight: '8px',
  },
  greyDf: {
    backgroundColor: theme.palette.grey.df,
    opacity: '0.5',
  },
  primaryMain: {
    backgroundColor: theme.palette.primary.main,
  },
  primaryMainTransparent: {
    backgroundColor: 'rgba(0,157,140,0.6)',
  },
  tagsAndPeriodContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 70px 30px 60px',
    [theme.breakpoints.down('sm')]: {
      padding: '0',
      flexWrap: 'wrap-reverse',
      justifyContent: 'center',
    },
  },
  globalSubtitle: {
    fontSize: '24px',
    lineHeight: '45px',
    fontWeight: '700',
    letterSpacing: '3%',
    [theme.breakpoints.down('sm')]: {
      fontSize: '20px',
      lineHeight: '24px',
      fontWeight: '400',
      fontFamily: 'Rubik',
    },
  },
  mobileMarginBottom10: {
    [theme.breakpoints.down('sm')]: {
      marginBottom: '10px',
    },
  },
  countryGalleryCard: {
    width: '420px',
    position: 'absolute',
    top: '50%',
    left: '-280px',
    padding: '50px',
    transform: 'translateY(-50%)',
    borderRadius: '10px',
    zIndex: '1',
    [theme.breakpoints.down('sm')]: {
      width: '100vw',
      left: '0',
    },
  },
  countryGalleryImg: {
    borderRadius: '10px',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100vw',
      borderRadius: '20px',
    },
  },
  countryGalleryImgContainer: {
    padding: '20px',
    minWidth: '850px',
    minHeight: '630px',
    '& > div': {
      minHeight: '583px',
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: '100vw',
      maxWidth: '100vw',
      minHeight: '340px',
      padding: '20px 0 20px 0',
      '& > div': {
        minHeight: '292px',
      },
    },
  },
  mobileCountryGalleryImgContainer: {
    width: '100%',
    '& > div': {
      minHeight: '200px',
    },
  },
  countryGalleryText: {
    fontSize: '14px',
    lineHeight: '24px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px',
    },
  },
  carouselNumbers: {
    fontSize: '38px',
    lineHeight: '44px',
    fontWeight: '500',
    color: theme.palette.primary.main,
  },
  carouselSize: {
    opacity: '0.20',
  },
  buttonsSpot: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    top: '76px',
    right: '0',
    zIndex: '3',
    height: '100px',
  },
  buttonPictureSlider: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    top: '160px',
    right: '220px',
    zIndex: '3',
    height: '100px',
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
  reasonCard: {
    maxWidth: '475px',
    borderRadius: '20px',
    padding: '40px 30px 30px',
    position: 'relative',
    backgroundColor: theme.palette.primary.ultraLight,
    [theme.breakpoints.down('sm')]: {
      padding: '45px 20px 20px 20px',
      width: '90%',
      margin: 'auto',
    },
  },
  reasonCardTitle: {
    fontSize: '24px',
    lineHeight: '30px',
    fontWeight: '500',
    marginBottom: '10px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '20px',
      lineHeight: '26px',
      fontFamily: 'Rubik',
      marginBottom: '15px',
    },
  },
  reasonCarouselNumber: {
    position: 'absolute',
    top: '-20px',
    left: '30px',
    width: '40px',
    height: '40px',
    borderRadius: '5px',
    fontSize: '22px',
    lineHeight: '26px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.contrastText,
  },
  reasonsIntroduction: {
    maxWidth: '70%',
    [theme.breakpoints.down('sm')]: {
      maxWidth: 'unset',
      marginBottom: '50px',
    },
  },
  reasonsHeader: {
    position: 'relative',
    marginBottom: theme.spacing(6),
  },
  globalButton: {
    fontSize: '18px',
    letterSpacing: '0.1rem',
    borderRadius: '50px',
    padding: '20px 60px',
    [theme.breakpoints.down('sm')]: {
      width: '70%',
      textTransform: 'none',
      letterSpacing: '0',
      padding: '18px 22px',
    },
  },
  subtitleCTA2: {
    fontSize: '22px',
    fontWeight: '400',
    lineHeight: '26px',
  },
  titleCTA2: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '38px',
      lineHeight: '43px',
    },
  },
  textCTA2Container: {
    maxWidth: '50%',
    [theme.breakpoints.down('sm')]: {
      maxWidth: 'unset',
      marginBottom: '60px',
    },
  },
  imageContainerCTA2: {
    width: '537px',
    height: '560px',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: 'unset',
    },
  },
  reviewButton: {
    padding: '18px 22px',
    textTransform: 'none',
  },
  paperReview: {
    padding: '30px',
    maxWidth: '45%',
    position: 'relative',
    backgroundColor: theme.palette.primary.ultraLight,
    borderRadius: '20px',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
      backgroundColor: theme.palette.primary.ultraLight,
      padding: '30px',
      borderRadius: '20px',
      boxShadow: 'unset',
      '&::before': {
        boxShadow: 'unset',
      },
    },
  },
  headReviewPaper: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: '20px',
  },
  reviewLink: {
    fontSize: '17px',
    color: theme.palette.primary.main,
  },
  reviewTitle: {
    fontSize: '28px',
    lineHeight: '32px',
    fontWeight: '700',
  },
  reviewUserAvatar: {
    marginRight: '25px',
    borderRadius: '50px',
    width: '80px',
    height: '80px',
  },
  smallPicsReview: {
    marginRight: '10px',
    borderRadius: '5px',
    width: '45px',
    height: '45px',
    [theme.breakpoints.down('sm')]: {
      width: '60px',
      height: '60px',
    },
  },
  mapAndImageButton: {
    borderRadius: '30px',
    boxShadow: ' 0px 1px 3px 0px #0000001A',
    fontSize: '17px',
    lineHeight: '27px',
    fontWeight: '400',
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.secondary.contrastText,
    minWidth: '172px',
    position: 'absolute',
    bottom: '50px',
    right: '50px',
    '&:hover': {
      backgroundColor: theme.palette.secondary.contrastText,
    },
    [theme.breakpoints.down('sm')]: {
      left: '10px',
      bottom: '10px',
    },
  },
  headerMapBox: {
    position: 'relative',
    top: '84px',
    width: '100%',
    height: '450px',
    [theme.breakpoints.down('sm')]: {
      top: '0',
    },
  },
  backButtonTop: {
    position: 'relative',
    top: '0',
    left: '0',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '30px',
      left: '35%',
    },
  },
  customTrendingDestinationsDotBox: {
    right: 'unset',
  },
  // Responsive Part
  mobileAlignCenter: {
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
  mobileSizing: {
    [theme.breakpoints.down('sm')]: {
      maxWidth: '90%',
      margin: 'auto',
    },
  },
  mobileCarouselItem: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
  },
  pictureSliderContainer: {
    width: '100%',
    height: '780px',
    margin: 'auto',
    objectFit: 'cover',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&::before': {
      content: `""`,
      filter: 'blur(50px)',
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      zIndex: '-1',
    },
  },
}))

const months = [
  'Jan',
  'Fev',
  'Mar',
  'Avr',
  'Mai',
  'Jui',
  'Juil',
  'Août',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
]

export async function getStaticPaths() {
  return {
    paths: [{ params: { slug: 'polynesie-francaise' } }],
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }) {
  const { slug } = params
  const doc = await database.ref().child(`content/spots/${slug}`).get()
  let dataset
  let dictionary
  let homePage
  if (doc.exists()) {
    dataset = doc.val()
    if (
      dataset?.publication?.website === 'false' ||
      typeof dataset?.publication?.website === 'undefined'
    ) {
      return {
        notFound: true,
      }
    }
    const dictionaryDoc = await database.ref().child(`dictionary`).get()
    if (dictionaryDoc.exists()) {
      dictionary = dictionaryDoc.val()
    }
    const homePageDoc = await database.ref().child(`page_structure/accueil`).get()
    if (homePageDoc.exists()) {
      homePage = homePageDoc.val()
    }
  }

  return {
    props: { dataset, dictionary, homePage, slug },
    revalidate: 1,
  }
}

const Spot = ({ dataset, dictionary, homePage, slug }) => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const { hotArticles, trendingDestinations } = homePage
  const refScrollUp = useRef(null)

  const [currentGalleryTile, setCurrentGalleryTile] = useState(0)
  const [currentPictureSlider, setCurrentPictureSlider] = useState(0)
  const [isShowingMap, setIsShowingMap] = useState(false)
  const [timeline, setTimeline] = useState([])
  const [showGoTop, setShowGoTop] = useState(false)
  const [trendingDestinationsItems, setTrendingDestinationsItems] = useState([])

  // useEffect(() => {
  //   if (typeof trendingDestinations !== 'undefined') {
  //     const trendingDestinationsKeys = Object.keys(trendingDestinations)
  //     const tempTrendingDestinationsArray = trendingDestinationsKeys.map(
  //       currentKey => trendingDestinations[currentKey]
  //     )
  //     setTrendingDestinationsItems(tempTrendingDestinationsArray)
  //   }
  // }, [])

  useEffect(() => {
    const tempTimeline = []
    if (dataset?.periode_visite) {
      dataset.periode_visite.forEach((currentMonth, index) => {
        if (index > 0) {
          tempTimeline.push({
            month: months[index - 1],
            visitMarker: currentMonth,
          })
        }
      })
    }
    setTimeline(tempTimeline)
  }, [matchesXs, dataset.periode_visite])

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

  const practicalInfoItems = [
    {
      Icon: Money,
      title: 'Devise',
      smallInfoText: dataset?.money?.nom,
      moneyCode: dataset?.money?.code,
      verySmallText: dataset?.money?.equivalent_1_euro,
    },
    {
      Icon: AvTimer,
      title: 'Fuseau',
      smallInfoText: 'UTC+2',
      // TODO rendre le fuseau horaire dynamique
    },
    {
      Icon: Language,
      title: 'Langues',
      smallInfoText: 'Allemand',
      // TODO rendre dynamique
    },
    {
      Icon: AccountBox,
      title: 'Visa & conseils',
      smallInfoText: dataset?.visa,
    },
  ]

  const legendTimeline = [
    {
      color: theme.palette.primary.main,
      label: dictionary.periode_visite[2],
    },
    {
      color: 'rgba(0, 157, 140, 0.6)',
      label: dictionary.periode_visite[1],
    },
    {
      color: theme.palette.grey.df,
      label: dictionary.periode_visite[0],
    },
  ]

  const associatedTags = [
    {
      colorClass: classes.tagColorGreen,
      label: 'Fêtes',
    },
    {
      colorClass: classes.tagColorRed,
      label: 'Culture',
    },
    {
      colorClass: classes.tagColorBlue,
      label: 'Tradition',
    },
    {
      colorClass: classes.tagColorRed,
      label: 'Randonnée',
    },
    {
      colorClass: classes.tagColorBlue,
      label: 'Paysages',
    },
    {
      colorClass: classes.tagColorGreen,
      label: 'Sport',
    },
    // Test avec + de tags
    // {
    //   colorClass: classes.tagColorBlue,
    //   label: 'Tradition',
    // },
    // {
    //   colorClass: classes.tagColorRed,
    //   label: 'Randonnée',
    // },
    // {
    //   colorClass: classes.tagColorBlue,
    //   label: 'Animaux',
    // },
    // {
    //   colorClass: classes.tagColorGreen,
    //   label: 'Détente',
    // },
  ] // TODO rendre dynamique

  const mobileBlogCard = [
    {
      title: 'Le Kenya',
      srcImg: blogPicture,
      subtitle: 'Partez à la découverte des paysages grandioses et variés du Kenya',
      likesCount: '12',
      commentsCount: '2',
    },
    {
      title: 'Le Kenya',
      srcImg: blogPicture,
      subtitle: 'Partez à la découverte des paysages grandioses et variés du Kenya',
      likesCount: '12',
      commentsCount: '2',
    },
    {
      title: 'Le Kenya',
      srcImg: blogPicture,
      subtitle: 'Partez à la découverte des paysages grandioses et variés du Kenya',
      likesCount: '12',
      commentsCount: '2',
    },
  ]

  const reasonsCarousel = [
    {
      cardTitle: dataset?.reasons[0].title,
      cardText: dataset?.reasons[0].description,
      cardTitle2: dataset?.reasons[1].title,
      cardText2: dataset?.reasons[1].description,
    },
    {
      cardTitle: dataset?.reasons[2].title,
      cardText: dataset?.reasons[2].description,
      cardTitle2: dataset?.reasons[3].title,
      cardText2: dataset?.reasons[3].description,
    },
    {
      cardTitle: dataset?.reasons[4].title,
      cardText: dataset?.reasons[4].description,
    },
  ]

  // const blogCard = [
  //   {
  //     category: hotArticles[0].meta[0],
  //     categoryColor: 'blue',
  //     bigTitle: hotArticles[0].title,
  //     srcImg: blogPicture3,
  //     // retirer l'exemple et rendre dynamique
  //     date: '03 Mai 2020',
  //     timestamp: '4 min',
  //   },
  //   {
  //     category: hotArticles[1].meta[0],
  //     categoryColor: 'red',
  //     bigTitle: hotArticles[1].title,
  //     srcImg: blogPicture,
  //     //  retirer l'exemple et rendre dynamique
  //     date: '29 Avril 2020',
  //     timestamp: '6 min',
  //   },
  //   {
  //     category: hotArticles[2].meta[0],
  //     bigTitle: hotArticles[2].title,
  //     srcImg: blogPicture2,
  //     //  retirer l'exemple et rendre dynamique
  //     date: '21 Mai 2020',
  //     timestamp: '12 min',
  //   },
  // ]

  const reviews = [
    {
      username: 'Bastien',
      countryExplomaker: `Parti en ${dataset.title} avec Explomaker`,
      userReview:
        "Nous avons choisi ExploMaker pour organiser notre lune de miel au Kenya. Nous avons demandé l'impossible et grâce à ses compétences, Damien, notre conseiller attitré, a fait de notre rêve une réalité. Le service est vraiment parfait. On bénéficie d’une expertise inestimable pour un prix qui en vaut vraiment la peine ! Il n'y a qu'a réserver en utilisant les liens transmis par la plateforme de préparation en ligne. Mille mercis ExploMaker 😍",
      avatarImg: '../../images/author-1.png',
      smallpics: [
        {
          srcImg: '../../images/g-1.png',
        },
        {
          srcImg: '../../images/g-2.png',
        },
        {
          srcImg: '../../images/g-3.png',
        },
      ],
    },
    {
      username: 'Anne-Sophie',
      countryExplomaker: `Parti en ${dataset.title} avec Explomaker`,
      userReview:
        "Nous venons de rentrer de notre voyage au Kenya. Après presque un mois, le retour est dur. Merci beaucoup à l'équipe ExploMaker et spécialement à Justine, pour son accompagnement dans la préparation. Tout était vraiment parfait. C'était la première fois que nous faisions appel à ce service et les premiers échanges nous ont rapidement mis en confiance. Nous recommandons vivement, et pour notre part, deux nouveaux séjours sont déjà en préparation avec ExploMaker !!",
      avatarImg: '../../images/author-2.png',
      smallpics: [
        {
          srcImg: '../../images/g-4.png',
        },
        {
          srcImg: '../../images/g-5.png',
        },
        {
          srcImg: '../../images/g-6.png',
        },
      ],
    },
  ]

  return (
    <>
      <Head
        title={dataset?.title}
        description={dataset?.catch_sentence}
        url={`https://explomaker.fr/spot/${slug}`}
        thumbnail={`https://storage.googleapis.com/stateless-www-explomaker-fr/${dataset?.picture_main.src.thumbnail}`}
      />
      <Box ref={refScrollUp} />
      {!matchesXs && (
        <GoTopBtn
          show={showGoTop}
          scrollUp={() => refScrollUp.current.scrollIntoView({ behavior: 'smooth' })}
        />
      )}
      {/* Partie 2 */}
      <Box marginBottom="100px">
        <Box />
      </Box>
      {/* fin de la partie 2 */}
      {/* carousel de photos */}
      <Box
        sx={{
          width: '100%',
          margin: 'auto',
          marginBottom: '80px',
          [theme.breakpoints.down('sm')]: {
            maxWidth: '100vw',
            margin: '0',
            position: 'relative',
            top: '-50px',
          },
        }}
      >
        {matchesXs ? (
          <>
            <MultiCarousel
              itemClass={classes.mobileCarouselItem}
              autoPlaySpeed={3000}
              draggable
              arrows={false}
              focusOnSelect={false}
              infinite
              showDots={false}
              renderDotsOutside
              keyBoardControl
              minimumTouchDrag={80}
              responsive={{
                desktop: {
                  breakpoint: {
                    max: 3000,
                    min: 640,
                  },
                  items: 1,
                },
                mobile: {
                  breakpoint: {
                    max: 640,
                    min: 0,
                  },
                  items: 1,
                },
              }}
              slidesToSlide={1}
              swipeable
              ssr
              deviceType="mobile"
            >
              {dataset.picture_slider.map(({ src, id }, index) => {
                const encodedURI = encodeURI(src.original)
                return (
                  <Box
                    width="100%"
                    minWidth="300px"
                    minHeight="200px"
                    maxHeight="200px"
                    position="relative"
                    key={id}
                  >
                    <Image
                      src={encodeURI(
                        `https://storage.googleapis.com/stateless-www-explomaker-fr/${encodedURI}`
                      )}
                      layout="fill"
                    />
                  </Box>
                )
              })}
            </MultiCarousel>
          </>
        ) : (
          <>
            <Carousel
              index={currentPictureSlider}
              onChange={currentIndex => setCurrentPictureSlider(currentIndex)}
              animation="slide"
              indicators={matchesXs}
              autoPlay={false}
              NavButton={() =>
                !matchesXs && (
                  <Box className={classes.buttonPictureSlider}>
                    <Button
                      className={classes.carouselArrow}
                      onClick={() => {
                        let nextIndex
                        if (currentPictureSlider > 0) {
                          nextIndex = currentPictureSlider - 1
                        } else {
                          nextIndex = dataset.picture_slider.length - 1
                        }
                        setCurrentPictureSlider(nextIndex)
                      }}
                    >
                      <ArrowRightAlt style={{ transform: 'rotate(180deg)' }} fontSize="large" />
                    </Button>
                    <Button
                      className={classes.carouselArrow}
                      onClick={() =>
                        setCurrentPictureSlider(
                          currentPictureSlider < dataset.picture_slider.length - 1
                            ? currentPictureSlider + 1
                            : 0
                        )
                      }
                    >
                      <ArrowRightAlt fontSize="large" />
                    </Button>
                  </Box>
                )
              }
            >
              {dataset.picture_slider.map(({ src, id }, index) => {
                const encodedURI = encodeURI(src.original)
                return (
                  <Box
                    key={id}
                    className={classes.pictureSliderContainer}
                    sx={{
                      '&::before': {
                        background: `url(https://storage.googleapis.com/stateless-www-explomaker-fr/${src.original})`,
                        backgroundSize: 'cover',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: '960px',
                        height: '640px',
                        position: 'relative',
                        zIndex: '1',
                        boxShadow: '0px 10px 45px rgba(0, 0, 0, 0.1)',
                        borderRadius: '20px 20px 0px 0px',
                      }}
                    >
                      <Image
                        src={`https://storage.googleapis.com/stateless-www-explomaker-fr/${encodedURI}`}
                        width={960}
                        height={640}
                      />
                    </Box>
                  </Box>
                )
              })}
            </Carousel>
          </>
        )}
      </Box>
      {/* Fin du carousel de photos */}
      {/* Partie 3 */}
      <Box marginBottom={matchesXs ? '60px' : '80px'}>
        <Box className={clsx(classes.mainContainer)}>
          {dataset.reasons &&
            (matchesXs ? (
              <>
                <Box className={classes.reasonsHeader}>
                  <Box className={classes.mobileSizing}>
                    <Box marginBottom="10px">
                      <Typography
                        variant="h3"
                        className={classes.globalSubtitle}
                        color="primary"
                        align="left"
                      >
                        Pourquoi partir en {dataset.title} ?
                      </Typography>
                    </Box>
                    <Box marginBottom="10px">
                      <Typography
                        variant="h1"
                        component="h2"
                        align="left"
                        className={classes.unmissableBigTitle}
                      >
                        Les {dataset.reasons.length} raisons qui te feront craquer&nbsp;✨
                      </Typography>
                    </Box>
                    <Typography
                      dangerouslySetInnerHTML={{ __html: dataset.reasons_introduction }}
                      className={classes.reasonsIntroduction}
                      align="left"
                    />
                  </Box>
                  <MultiCarousel
                    itemClass={classes.mobileCarouselItem}
                    autoPlaySpeed={3000}
                    draggable
                    arrows={false}
                    focusOnSelect={false}
                    infinite
                    showDots={false}
                    renderDotsOutside
                    keyBoardControl
                    minimumTouchDrag={80}
                    responsive={{
                      desktop: {
                        breakpoint: {
                          max: 3000,
                          min: 640,
                        },
                        items: 1,
                      },
                      mobile: {
                        breakpoint: {
                          max: 640,
                          min: 0,
                        },
                        items: 1,
                      },
                    }}
                    slidesToSlide={1}
                    swipeable
                    ssr
                    deviceType="mobile"
                  >
                    {dataset.reasons.map(({ title: cardTitle, description: cardText }, index) => (
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        paddingTop="20px"
                        key={cardTitle}
                      >
                        <Paper elevation={0} className={classes.reasonCard}>
                          <Box className={classes.reasonCarouselNumber}>{index + 1}</Box>
                          <Typography variant="h3" className={classes.reasonCardTitle}>
                            {cardTitle}
                          </Typography>
                          <Typography
                            className={clsx(classes.mobileAlignCenter, classes.smallInfoTextStyle)}
                          >
                            {cardText}
                          </Typography>
                        </Paper>
                      </Box>
                    ))}
                  </MultiCarousel>
                </Box>
              </>
            ) : (
              <>
                <Box className={classes.reasonsHeader}>
                  <Typography
                    variant="h3"
                    className={classes.globalSubtitle}
                    color="primary"
                    align="left"
                  >
                    Pourquoi partir en {dataset.title} ?
                  </Typography>
                  <Box marginBottom="10px">
                    <Typography
                      variant="h1"
                      component="h2"
                      align="left"
                      className={classes.unmissableBigTitle}
                    >
                      Les {dataset.reasons.length} raisons qui te feront craquer ✨
                    </Typography>
                  </Box>
                  <Typography
                    dangerouslySetInnerHTML={{ __html: dataset.reasons_introduction }}
                    className={classes.reasonsIntroduction}
                  />
                </Box>
                <Box position="relative">
                  <MultiCarousel
                    autoPlaySpeed={3000}
                    centerMode={false}
                    draggable
                    arrows={false}
                    focusOnSelect={false}
                    infinite
                    renderButtonGroupOutside
                    customButtonGroup={<TrendingDestinationsGroupButton />}
                    showDots
                    customDot={<TrendingDestinationsDotBox carouselArray={reasonsCarousel} />}
                    renderDotsOutside
                    keyBoardControl
                    minimumTouchDrag={80}
                    partialVisible
                    responsive={{
                      desktop: {
                        breakpoint: {
                          max: 3000,
                          min: 640,
                        },
                        items: 2,
                        partialVisibilityGutter: 40,
                      },
                      mobile: {
                        breakpoint: {
                          max: 640,
                          min: 0,
                        },
                        items: 1,
                        partialVisibilityGutter: 30,
                      },
                    }}
                    slidesToSlide={1}
                    swipeable
                    ssr
                  >
                    {dataset.reasons.map(({ title: cardTitle, description: cardText }, index) => (
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        paddingTop="20px"
                        key={cardTitle}
                      >
                        <Paper elevation={0} className={classes.reasonCard}>
                          <Box className={classes.reasonCarouselNumber}>{index + 1}</Box>
                          <Typography variant="h3" className={classes.reasonCardTitle}>
                            {cardTitle}
                          </Typography>
                          <Typography
                            className={clsx(classes.mobileAlignCenter, classes.smallInfoTextStyle)}
                          >
                            {cardText}
                          </Typography>
                        </Paper>
                      </Box>
                    ))}
                  </MultiCarousel>
                </Box>
              </>
            ))}
        </Box>
      </Box>
      {/* Fin de la partie 3 */}
      {/* Partie 4 */}
      {hotArticles && (
        <Box
          marginBottom="150px"
          className={clsx({ [classes.mobileBlogCardContainer]: matchesXs })}
        >
          <Box
            className={clsx(classes.mobileSizing, classes.mainContainer)}
            display="flex"
            alignItems={matchesXs ? 'stretch' : 'center'}
            justifyContent="space-between"
            flexDirection="column"
          >
            <Box marginBottom="40px">
              <Typography
                variant="h3"
                color="primary"
                align={matchesXs ? 'left' : 'center'}
                className={clsx(classes.globalSubtitle, classes.mobileMarginBottom10)}
              >
                T&rsquo;en veux encore ?
              </Typography>
              <Typography
                variant="h1"
                component="h2"
                align="left"
                className={classes.unmissableBigTitle}
              >
                Consulte nos articles sur l&rsquo;{dataset.title}
              </Typography>
              {/* TODO rendre dynamique */}
            </Box>
            <Box
              display="flex"
              width="100%"
              justifyContent="space-between"
              alignItems="center"
              marginBottom="60px"
            >
              {/* {matchesXs ? (
                <Carousel
                  animation="slide"
                  autoPlay={false}
                  navButtonsAlwaysInvisible
                  indicators={false}
                >
                  {mobileBlogCard.map(({ title, srcImg, subtitle, commentsCount, likesCount }) => (
                    <MobileBlogCard
                      key={uuidv4()}
                      title={title}
                      srcImg={srcImg}
                      subtitle={subtitle}
                      commentsCount={commentsCount}
                      likesCount={likesCount}
                    />
                  ))}
                </Carousel>
              ) : (
                blogCard.map(({ category, bigTitle, srcImg, date, timestamp, categoryColor }) => (
                  <BlogCard
                    key={uuidv4()}
                    isHeartStroke
                    isSmallSize
                    category={category}
                    categoryColor={categoryColor}
                    bigTitle={bigTitle}
                    srcImg={srcImg}
                    date={date}
                    timestamp={timestamp}
                  />
                ))
              )} */}
            </Box>
            <Button variant="contained" className={classes.globalButton}>
              Voir tous les articles
            </Button>
          </Box>
        </Box>
      )}
      {/* Fin de la partie 4 */}
      {/* CTA 2 */}
      <Box marginBottom={matchesXs ? '120px' : '150px'}>
        <Box className={clsx(classes.mainContainer, classes.mobileSizing)}>
          <Box
            display="flex"
            width="100%"
            alignItems="center"
            justifyContent="space-between"
            position="relative"
            flexWrap={matchesXs ? 'wrap' : 'no-wrap'}
          >
            <Box className={clsx(classes.textCTA2Container)}>
              <Box marginBottom="20px">
                <Typography variant="h6" className={classes.subtitleCTA2} color="primary">
                  Inspiré ?
                </Typography>
              </Box>
              <Box marginBottom="20px">
                <Typography variant="h1" component="h2" className={classes.titleCTA2}>
                  Prépare ton séjour en {dataset.title} avec Explomaker
                </Typography>
              </Box>
              {/* TODO rendre Dynamique */}
              <Box marginBottom="50px">
                <Typography>
                  Crées gratuitement ton séjour sur Explomaker ! L’outil collaboratif complet qui
                  t’accompagne avant, pendant et après ton séjour.
                </Typography>
              </Box>
              <Button variant="contained" className={classes.globalButton}>
                Créer mon séjour
              </Button>
            </Box>
            <Box className={classes.imageContainerCTA2}>
              <Image src={planningImg} width={537} quality={100} />
            </Box>
          </Box>
        </Box>
      </Box>
      {/* fin du CTA2}
      {/* Partie 5 */}
      {dataset.review && (
        <Box marginBottom="150px">
          <Box className={clsx(classes.mainContainer, classes.mobileSizing)}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Box marginBottom="40px">
                <Typography
                  variant="h3"
                  className={clsx(classes.mobileMarginBottom10, classes.globalSubtitle)}
                  color="primary"
                  align={matchesXs ? 'left' : 'center'}
                >
                  L&rsquo;avis des Explorateurs
                </Typography>
                <Typography variant="h1" component="h2" align={matchesXs ? 'left' : 'center'}>
                  Ils sont partis en {dataset.title}
                </Typography>
              </Box>
              <Box
                display="flex"
                width="100%"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                {matchesXs ? (
                  <Carousel
                    animation="slide"
                    autoPlay={false}
                    navButtonsAlwaysInvisible
                    indicators={false}
                  >
                    {reviews.map(
                      ({ avatarImg, username, countryExplomaker, userReview, smallpics }) => (
                        <Paper elevation={0} key={username} className={classes.paperReview}>
                          <Box className={classes.headReviewPaper}>
                            <img src={avatarImg} alt="" className={classes.reviewUserAvatar} />
                            <Box display="flex" flexDirection="column">
                              <Typography variant="h3" className={classes.reviewTitle}>
                                {matchesXs ? username : `L&rsquo;avis de ${username}`}
                              </Typography>
                              <Typography className={classes.ultraDark}>
                                {countryExplomaker}
                              </Typography>
                            </Box>
                          </Box>
                          <Box marginBottom="30px">
                            <Typography>
                              {userReview}{' '}
                              <Link href="/" className={classes.reviewLink}>
                                Voir Tout
                              </Link>
                            </Typography>
                          </Box>
                          <Box display="flex" width="100%" justifyContent="space-between">
                            <Box className={classes.reviewPicsContainer}>
                              {smallpics.map(({ srcImg }) => (
                                <img
                                  src={srcImg}
                                  alt=""
                                  className={classes.smallPicsReview}
                                  key={srcImg}
                                />
                              ))}
                            </Box>
                          </Box>
                        </Paper>
                      )
                    )}
                  </Carousel>
                ) : (
                  reviews.map(
                    ({ avatarImg, username, countryExplomaker, userReview, smallpics }) => (
                      <Paper elevation={0} key={username} className={classes.paperReview}>
                        <Box className={classes.headReviewPaper}>
                          <img src={avatarImg} alt="" className={classes.reviewUserAvatar} />
                          <Box display="flex" flexDirection="column">
                            <Typography variant="h3" className={classes.reviewTitle}>
                              {matchesXs ? username : `L'avis de ${username}`}
                            </Typography>
                            <Typography className={classes.ultraDark}>
                              {countryExplomaker}
                            </Typography>
                          </Box>
                        </Box>
                        <Box marginBottom="30px">
                          <Typography>{userReview}</Typography>
                        </Box>
                        <Box display="flex" width="100%" justifyContent="space-between">
                          <Box className={classes.reviewPicsContainer}>
                            {smallpics.map(({ srcImg }) => (
                              <img
                                src={srcImg}
                                alt=""
                                className={classes.smallPicsReview}
                                key={srcImg}
                              />
                            ))}
                          </Box>
                          <Button
                            variant="contained"
                            className={clsx(classes.globalButton, classes.reviewButton)}
                          >
                            Voir ses photos
                          </Button>
                        </Box>
                      </Paper>
                    )
                  )
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      {/* fin de la Partie 5 */}
      {/* Partie 6 */}
      <Box marginBottom="150px">
        <Box className={classes.mainContainer}>
          {/* <TrendingDestinations
            trendingDestinationsItems={trendingDestinationsItems}
            dotListClass={classes.customTrendingDestinationsDotBox}
          /> */}
        </Box>
      </Box>
      {/* fin de la Partie 6 */}
    </>
  )
}
export default Spot
