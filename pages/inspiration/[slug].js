import { useMediaQuery } from '@mui/material'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { makeStyles, useTheme } from '@mui/styles'
import Image from 'next/image'

import WPGBlocks from 'react-gutenberg'
import 'react-gutenberg/default.css'

import SignatureProfile from '../../components/molecules/SignatureProfile'
import headerImg from '../../images/Kenya 2.png'
import mobileHeaderImg from '../../images/tom-pavlakos-NQuDiZISPtk-unsplash2.png'

// import { testArticle } from '../../helper/testArticle'
import { database } from '../../lib/firebase'

const useStyles = makeStyles(theme => ({
  headerMapBox: {
    position: 'relative',
    top: '84px',
    width: '100%',
    height: '450px',
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
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      padding: '40px 0px 0 30px',
    },
    '& a': {
      textTransform: 'none',
      textDecoration: 'none',
      color: theme.palette.primary.main,
    },
    '& strong': {
      color: theme.palette.primary.main,
    },
    '& figCaption': {
      maxWidth: '322px',
      overflow: 'hidden',
      padding: '6px 10px',
      backgroundColor: theme.palette.primary.ultraLight,
      color: theme.palette.primary.main,
    },
  },
  mainContainer: {
    maxWidth: '1240px',
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      maxWidth: '100%',
    },
  },
  '& .wpg-blocks': {
    backgroundColor: 'green !important',
    fontSize: '60px',
    width: '20px !important',
  },
}))
export async function getStaticPaths() {
  return {
    paths: [
      {
        params: {
          slug: 'les-jeux-de-pistes-urbains-une-aventure-trepidante-pour-un-city-trip-reussi',
        },
      },
    ],
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }) {
  const { slug } = params
  const doc = await database.ref().child(`content/post/${slug}`).get()
  let dataset
  let dictionary
  let homePage
  if (doc.exists()) {
    dataset = doc.val()
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

export default function Article({ dataset, dictionary, homePage, slug }) {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box>
      <Box className={classes.headerMapBox}>
        <Image src={!matchesXs ? headerImg : mobileHeaderImg} layout="fill" objectFit="cover" />
      </Box>
      <Box className={classes.mainContainer} sx={{ position: 'relative', top: '-100px' }}>
        <Paper elevation={0} className={classes.headingPaper}>
          <Box sx={{ maxWidth: '380px', width: '380px' }}>
            <SignatureProfile />
          </Box>
          <Box sx={{ maxWidth: '760px' }}>
            <WPGBlocks blocks={dataset.blocks} />
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}
