import { useEffect, useState } from 'react'
import Image from 'next/image'
import { makeStyles, useTheme } from '@mui/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'

import { database } from '../lib/firebase'

import headerImg from '../images/inspirationHeaderImg.png'
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
  },
  headerMapBox: {
    position: 'relative',
    top: '84px',
    width: '100%',
    height: '550px',
    [theme.breakpoints.down('sm')]: {
      top: '0',
    },
  },
  headingPaper: {
    padding: '50px 50px 30px 60px',
    position: 'relative',
    borderRadius: '40px 40px 0 0',
    [theme.breakpoints.down('sm')]: {
      padding: '25px 10px 30px',
    },
  },
  headerSearchbar: {
    position: 'absolute',
    left: '35%',
    top: '30%',
  },
  rootInput: {
    width: '441px',
    borderRadius: '50px',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    textShadow: '#000000BF 0px 2px 6px',
    fontFamily: 'Rubik',
    marginBottom: '30px',
  },
  fewWordsTitle: {
    fontSize: '28px',
    lineHeight: '32px',
    fontWeight: '700',
    marginBottom: '10px',
    fontFamily: theme.typography.fontFamily,
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
    paddingBottom: '60px',
  },
  continentGrid: {
    display: 'grid',
    width: '1140px',
    gridTemplate: '1fr 1fr / repeat(4, 1fr) ',
    alignItems: 'center',
    justifyItems: 'center',
    gridGap: '30px',
  },
}))

export async function getStaticProps() {
  const doc = await database.ref().child(`page_structure`).get()
  const dictionary = await database.ref().child(`dictionary`).get()
  let spotlight
  let monthDestination
  let favoritesArticles
  let metaContinentRef
  if (doc.exists()) {
    const spotlightDoc = await database.ref().child(`page_structure/inspiration/spotLight`).get()
    if (spotlightDoc.exists()) {
      spotlight = spotlightDoc.val()
    }
    const monthDestinationsDoc = await database
      .ref()
      .child(`page_structure/inspiration/monthDestination`)
      .get()
    if (monthDestinationsDoc.exists()) {
      monthDestination = monthDestinationsDoc.val()
    }
    const favoritesArticlesDoc = await database
      .ref()
      .child(`page_structure/inspiration/favoritesArticles`)
      .get()
    if (favoritesArticlesDoc.exists()) {
      favoritesArticles = favoritesArticlesDoc.val()
    }
  }

  if (dictionary.exists()) {
    const metaContinentRefDoc = await database.ref().child('dictionary/meta_continent').get()
    if (metaContinentRefDoc.exists()) {
      metaContinentRef = metaContinentRefDoc.val()
    }
  }

  return {
    props: { spotlight, monthDestination, favoritesArticles, metaContinentRef },
    revalidate: 1,
  }
}

const Inspiration = ({ spotlight, monthDestination, favoritesArticles, metaContinentRef }) => {
  const classes = useStyles()
  const theme = useTheme()
  const [isShowingAllArticles, setIsShowingAllArticles] = useState(false)
  const [currentSpotlightArticles, setCurrentSpotlightArticles] = useState([])
  const [isShowingAllSpots, setIsShowingAllSpots] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const continentArray = [
    {
      name: 'Europe',
      img: europa,
      hoverImg: europaWhite,
    },
    {
      name: 'Afrique',
      img: africa,
      hoverImg: africaWhite,
    },
    {
      name: 'Asie',
      img: asia,
      hoverImg: asiaWhite,
    },
    {
      name: 'Océanie',
      img: oceania,
      hoverImg: oceaniaWhite,
    },
    {
      name: 'Amérique centrale',
      img: centralAmerica,
      hoverImg: centralAmericaWhite,
    },
    {
      name: 'Amérique du Nord',
      img: northAmerica,
      hoverImg: northAmericaWhite,
    },
    {
      name: 'Amérique du Sud',
      img: southAmerica,
      hoverImg: southAmericaWhite,
    },
    {
      name: 'Moyen-Orient',
      img: middleEast,
      hoverImg: middleEastWhite,
    },
  ]
  useEffect(() => {
    if (typeof spotlight !== 'undefined') {
      const ArticlesKeys = Object.keys(spotlight.linked_posts)
      const tempArticlesArray = ArticlesKeys.map(currentKey => spotlight.linked_posts[currentKey])
      setCurrentSpotlightArticles(tempArticlesArray)
    }
  }, [spotlight])

  return (
    <Box>
      <Box className={classes.headerMapBox}>
        <Image src={headerImg} layout="fill" />
        <Box className={classes.headerSearchbar}>
          <Typography color="white" variant="h3" paddingLeft="65px" className={classes.headerTitle}>
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
          <Box display="flex" marginBottom="60px">
            <Box marginRight="50px">
              <CountryTile
                countryTitle={spotlight.prefixed_title}
                srcImg={`https://storage.googleapis.com/stateless-www-explomaker-fr/${spotlight.picture_titled.src.original}`}
                altImg="test img"
                link={spotlight.slug}
                category={metaContinentRef[parseInt(spotlight.meta_continent[0], 10)].name}
              />
            </Box>
            <Box>
              <Typography
                variant="h6"
                color="primary.ultraDark"
                fontWeight="400"
                sx={{ marginBottom: '15px' }}
              >
                À la Une
              </Typography>
              <Typography variant="h1" sx={{ marginBottom: '20px' }}>
                {spotlight.title}
              </Typography>
              <Typography variant="h2" className={classes.fewWordsTitle}>
                En quelques mots
              </Typography>
              <Typography dangerouslySetInnerHTML={{ __html: spotlight.few_words }} />
            </Box>
          </Box>
          {/* fin de Partie 1 */}
          {/* Partie 2 liste de BlogCard */}
          <Box marginBottom="60px">
            <Typography variant="h6" color="grey.grey33">
              Articles sur {spotlight.prefixed_title}
            </Typography>
            <ArticlesList
              data={currentSpotlightArticles}
              isShowingAllArticles={isShowingAllArticles}
              isSmallSize
              numberOfArticles={3}
            />
            <Box display="flex" justifyContent="center">
              {!isShowingAllArticles ? (
                <Button
                  variant="contained"
                  className={classes.buttonPrimary}
                  onClick={() => setIsShowingAllArticles(true)}
                  sx={{ width: '13%' }}
                >
                  Voir tout
                </Button>
              ) : (
                <Button
                  variant="contained"
                  className={classes.buttonPrimary}
                  onClick={() => setIsShowingAllArticles(false)}
                  sx={{ width: '13%' }}
                >
                  Voir moins
                </Button>
              )}
            </Box>
          </Box>
          {/* fin de Partie 2 */}
          {/* Partie 3 liste de spots */}
          <Box>
            <Typography variant="h6" color="grey.grey33" marginBottom="15px">
              Spots en {spotlight.title}
            </Typography>
            <Box className={classes.spotResultContainer}>
              <SpotList data={spotlight.unmissable} isShowingAllSpots={isShowingAllSpots} />
            </Box>
            <Box display="flex" justifyContent="center">
              {!isShowingAllSpots ? (
                <Button
                  variant="contained"
                  className={classes.buttonPrimary}
                  onClick={() => setIsShowingAllSpots(true)}
                  sx={{ width: '13%' }}
                >
                  Voir tout
                </Button>
              ) : (
                <Button
                  variant="contained"
                  className={classes.buttonPrimary}
                  onClick={() => setIsShowingAllSpots(false)}
                  sx={{ width: '13%' }}
                >
                  Voir moins
                </Button>
              )}
            </Box>
          </Box>
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
          padding: '60px 0',
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
            {continentArray.map(({ name, img, hoverImg }, index) => (
              <ContinentCard
                continentTitle={name}
                continentImg={img}
                continentHoverImg={hoverImg}
                setIsHovering={setIsHovering}
                isHovering={isHovering}
                index={index}
                key={name}
              />
            ))}
          </Box>
        </Box>
      </Box>
      {/* fin de Partie 4 liste de continents */}
      {/* Partie 5 liste des */}
    </Box>
  )
}
export default Inspiration
