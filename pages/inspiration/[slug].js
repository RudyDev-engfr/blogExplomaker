import { useMediaQuery } from '@mui/material'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { makeStyles, useTheme } from '@mui/styles'
import { useEffect } from 'react'
import Image from 'next/image'

import WPGBlocks from '../../helper/react-gutenberg'
import GetCustomBlock from '../../components/GutenbergCustomBlock'

import SignatureProfile from '../../components/molecules/SignatureProfile'
import headerImg from '../../images/Kenya 2.png'
import mobileHeaderImg from '../../images/tom-pavlakos-NQuDiZISPtk-unsplash2.png'

// import { testArticle } from '../../helper/testArticle'
import { database } from '../../lib/firebase'
import MobileSearchButton from '../../components/atoms/MobileSearchButton'
import { ArticlesSlugsArray } from '../../helper/slugsArray'
import ButtonLike from '../../components/atoms/ButtonLike'
import ButtonBookmark from '../../components/atoms/ButtonBookmark'
import Head from '../../components/molecules/Head'

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
      padding: '40px 30px 30px 30px',
    },
    '& a': {
      textTransform: 'none',
      textDecoration: 'none',
      color: theme.palette.primary.main,
    },
    // '& strong': {
    //   color: theme.palette.primary.main,
    // },
    '& figCaption': {
      maxWidth: '80%',
      overflow: 'hidden',
      padding: '6px 10px',
      backgroundColor: theme.palette.primary.ultraLight,
      color: theme.palette.primary.main,
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: '22px',
      position: 'relative',
      top: '-20px',
      left: '10%',
      borderRadius: '5px',
      zIndex: 3,
    },
    '& h2': {
      fontSize: '32px',
      fontWeight: '400',
      lineHeight: '37px',
      color: theme.palette.primary.ultraDark,
      margin: '32px 0 10px 0',
      width: '100%',
    },
    '& img': {
      borderRadius: '20px',
      [theme.breakpoints.down('sm')]: {
        position: 'relative',
      },
    },
  },
  mainContainer: {
    maxWidth: '1240px',
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
      width: '100vw',
      maxWidth: '100vw',
    },
  },
  categoryBox: {
    backgroundColor: theme.palette.primary.ultraLight,
    display: 'inline-block',
    padding: '8px 15px',
    borderRadius: '30px',
    marginBottom: '32px',
  },
  interactionBox: {
    display: 'flex',
  },
}))

export async function getStaticPaths() {
  return {
    paths: ArticlesSlugsArray,
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

  let metaDoc
  try {
    metaDoc = await database.ref().child(`content/post/${slug}`).get()
  } catch (error) {
    console.error(error)
    return { notFound: true }
  }

  const articleData = metaDoc.val()

  return {
    props: { dataset, dictionary, homePage, slug, articleData },
    revalidate: 1,
  }
}

export default function Article({ dataset, articleData }) {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <>
      <Head tags={articleData} />
      <Box>
        {matchesXs && <MobileSearchButton />}
        <Box className={classes.headerMapBox}>
          <Image
            src={`https://storage.googleapis.com/explomaker-data-stateless/${encodeURI(
              dataset.picture.src.original
            )}`}
            alt="header_image"
            fill
            sizes="100vw"
            style={{
              objectFit: 'cover',
            }}
          />
        </Box>
        <Box className={classes.mainContainer} sx={{ position: 'relative', top: '-100px' }}>
          <Paper elevation={0} className={classes.headingPaper}>
            {!matchesXs && (
              <Box sx={{ maxWidth: '380px', width: '380px' }}>
                <Box marginBottom="60px">
                  <SignatureProfile
                    date={dataset.creation_date}
                    readingTime={dataset.reading_time}
                    tags={dataset.meta}
                    profileName={dataset.creator.name}
                    avatarSrc={dataset.creator.picture}
                  />
                </Box>
                {!matchesXs && (
                  <Box className={classes.interactionBox}>
                    <Box marginRight="10px">
                      <ButtonLike isArticle articleSlug={dataset.slug} />
                    </Box>
                    <ButtonBookmark isArticle articleSlug={dataset.slug} />
                  </Box>
                )}
              </Box>
            )}
            <Box
              sx={{
                maxWidth: '760px',
                [theme.breakpoints.down('sm')]: { maxWidth: 'calc(100vw - 60px)' },
              }}
            >
              <Box display="flex" justifyContent="center" className={classes.categoryBox}>
                <Typography
                  sx={{
                    fontSize: matchesXs ? '14px' : '12px',
                    fontWeight: '500',
                    color: theme.palette.primary.main,
                    lineHeight: matchesXs ? '14px' : '16px',
                  }}
                >
                  {dataset.sub_type[0].name}
                </Typography>
              </Box>
              <Typography variant="h1">{dataset.title}</Typography>
              <WPGBlocks blocks={dataset.blocks} />
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  )
}
