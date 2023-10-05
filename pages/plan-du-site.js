import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import { makeStyles, useTheme } from '@mui/styles'
import { database } from '../lib/firebase'
import Head from '../components/molecules/Head'

const getServerSideProps = async () => {
  try {
    const doc = await database.ref().child(`content`).get()
    const homePagesDoc = await database.ref().child(`page_structure/home_pages`).get()
    const dictionary = await database.ref().child(`dictionary`).get()

    let metaContinentRef

    if (doc.exists() && homePagesDoc.exists() && dictionary.exists()) {
      const dataset = doc.val()
      const homePageDataset = homePagesDoc.val()
      const spotDataset = dataset.spots
      const articleDataset = dataset.post

      if (dictionary.exists()) {
        const metaContinentRefDoc = await database.ref().child('dictionary/meta_continent').get()
        if (metaContinentRefDoc.exists()) {
          metaContinentRef = metaContinentRefDoc.val()
        }

        return {
          props: { homePageDataset, spotDataset, articleDataset, metaContinentRef },
        }
      }
    }
    return {
      props: {},
    }
  } catch (error) {
    // Dans le cas où les données n'existent pas, il serait bon de retourner un objet vide
    // ou de gérer cette situation d'une autre manière, selon vos besoins.
    console.error('Erreur :', error)
    return {
      props: {},
    }
  }
}

const useStyles = makeStyles(theme => ({
  mainContainer: {
    width: '1140px',
    margin: 'auto',
    paddingTop: '115px',
    [theme.breakpoints.down('sm')]: {
      width: '100vw',
      textAlign: 'center',
    },
  },
  nextLink: {
    textDecoration: 'none',
  },
  continentContainer: {
    marginBottom: '40px',
  },
  articlesContainer: { width: '100vw' },
}))

const SitePlan = ({ homePageDataset, spotDataset, articleDataset, metaContinentRef }) => {
  const classes = useStyles()
  const theme = useTheme()
  const [spots, setSpots] = useState([])
  const [articles, setArticles] = useState([])
  const [homePages, setHomePages] = useState([])
  // const [sortedAndRenderedSpots, setSortedAndRenderedSpots] = useState([])

  // useEffect(() => {
  //   let sortedAndRendered
  //   if (spots?.length > 0) {
  //     const groupedByMetaContinent = spots?.filter(spot => spot.publication.website !== 'false')
  //     console.log(groupedByMetaContinent)
  //     // ... (la logique de réduction/groupage que nous avons déjà discutée)
  //     if (groupedByMetaContinent?.length > 0) {
  //       sortedAndRendered = Object.entries(groupedByMetaContinent).map(
  //         ([metaContinent, groupedSpots], index) => {
  //           // Vérification que metaContinent et groupedSpots sont valides
  //           console.log(`groupedSpots${index}`, groupedSpots)
  //           console.log(`metaContinent${index}`, metaContinent)
  //           if (metaContinent && typeof groupedSpots === 'object') {
  //             return (
  //               <div key={metaContinent}>
  //                 <Typography variant="h6">{metaContinentRef[metaContinent]}</Typography>
  //                 {Object.values(groupedSpots).map(spot => (
  //                   <Link
  //                     key={spot.targetUrl}
  //                     href={spot.targetUrl}
  //                     passHref
  //                     className={classes.nextLink}
  //                   >
  //                     <Typography>{spot.title}</Typography>
  //                   </Link>
  //                 ))}
  //               </div>
  //             )
  //           }
  //           return null
  //         }
  //       )
  //     }
  //   }
  //   setSortedAndRenderedSpots(sortedAndRendered)
  // }, [spots])

  // useEffect(() => {
  //   console.log('sortedAndRenderedSpots', sortedAndRenderedSpots)
  // }, [sortedAndRenderedSpots])

  useEffect(() => {
    console.log('homePages', homePages)
    console.log('articles', articles)
    console.log('spots', spots)
  }, [spots, articles, homePages])

  useEffect(() => {
    console.log(
      'je rentre dans le useEffect qui surveille les data arrivées avec getServerSideProps'
    )
    if (typeof homePageDataset !== 'undefined' || homePageDataset !== {}) {
      const homePagesKeys = Object.keys(homePageDataset)
      const tempHomePagesArray = homePagesKeys.map(currentKey => homePageDataset[currentKey])
      setHomePages(tempHomePagesArray)
    }

    if (typeof spotDataset !== 'undefined' || spotDataset !== {}) {
      const spotsKeys = Object.keys(spotDataset)
      const tempSpotsArray = spotsKeys.map(currentKey => spotDataset[currentKey])
      setSpots(tempSpotsArray.filter(spot => spot.publication.website !== 'false'))
    }

    if (typeof articleDataset !== 'undefined' || articleDataset !== {}) {
      const articlesKeys = Object.keys(articleDataset)
      const tempArticlesArray = articlesKeys.map(currentKey => articleDataset[currentKey])
      setArticles(tempArticlesArray)
    }
    console.log('homePageDataset', homePageDataset)
    console.log('spotDataset', spotDataset)
    console.log('articleDataset', articleDataset)
  }, [homePageDataset, spotDataset, articleDataset])

  useEffect(() => {
    console.log('spots', spots)
    console.log('articles', articles)
    console.log('homepages', homePages)
  }, [articles, spots, homePages])

  return (
    <>
      <Head />
      <Box className={classes.mainContainer}>
        <Box className={classes.homePageContainer}>
          <Typography sx={{ fontSize: '28px', fontWeight: 600, marginBottom: '15px' }}>
            Occasions
          </Typography>
          {/* {homePages?.map(({ target_url: targetUrl, title }) => (
            <Box>
              <Link className={classes.nextLink} href={targetUrl} passHref>
                <Typography sx={{ '&:hover': { textDecoration: 'underline' } }}>{title}</Typography>
              </Link>
            </Box>
          ))} */}
        </Box>
        <Box className={classes.continentContainer}>
          <Typography sx={{ fontSize: '28px', fontWeight: 600, marginBottom: '15px' }}>
            Destinations
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplate: 'auto / repeat(3, 380px)',
              [theme.breakpoints.down('sm')]: { gridTemplate: 'auto / 100vw' },
            }}
          >
            {spots?.map(({ target_url: targetUrl, title }) => (
              <Box>
                <Link className={classes.nextLink} href={targetUrl} passHref>
                  <Typography sx={{ '&:hover': { textDecoration: 'underline' } }}>
                    {title}
                  </Typography>
                </Link>
              </Box>
            ))}
          </Box>
        </Box>
        <Box className={classes.articlesContainer}>
          <Typography sx={{ fontSize: '28px', fontWeight: 600, marginBottom: '15px' }}>
            Articles
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplate: 'auto / 100vw',
              gridRowGap: '10px',
              gridColumnGap: '50px',
            }}
          >
            {articles.map(({ target_url: targetUrl, title }) => (
              <Box sx={{ height: '50px', [theme.breakpoints.down('sm')]: { height: 'unset' } }}>
                <Link className={classes.nextLink} href={targetUrl} passHref>
                  <Typography
                    sx={{ '&:hover': { textDecoration: 'underline' }, lineHeight: '25px' }}
                  >
                    {title}
                  </Typography>
                </Link>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default SitePlan
