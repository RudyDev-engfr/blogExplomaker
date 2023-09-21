import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import { makeStyles } from '@mui/styles'
import { database } from '../lib/firebase'
import Head from '../components/molecules/Head'

export const getServerSideProps = async () => {
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

    // Dans le cas où les données n'existent pas, il serait bon de retourner un objet vide
    // ou de gérer cette situation d'une autre manière, selon vos besoins.
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
  },
  nextLink: {
    textDecoration: 'none',
  },
}))

const SitePlan = ({ homePageDataset, spotDataset, articleDataset, metaContinentRef }) => {
  const classes = useStyles()
  const [spots, setSpots] = useState([])
  const [articles, setArticles] = useState([])
  const [homePages, setHomePages] = useState([])

  useEffect(() => {
    console.log('homePages', homePages)
    console.log(
      'spots',
      spots
        .filter(spot => spot.publication.website !== 'false')
        .reduce((acc, { meta_continent: metaContinentArray, target_url: targetUrl, ...rest }) => {
          // Récupérer la valeur de metaContinent à partir de l'index 0 du tableau
          if (metaContinentArray && metaContinentArray.length > 0) {
            const metaContinent = metaContinentArray[0]
            if (!acc[metaContinent]) {
              acc[metaContinent] = []
            }
            acc[metaContinent].push({ metaContinent, targetUrl, ...rest })
          }
          return acc
        }, {})
    )
    console.log('articles', articles)
  }, [spots, articles, homePages])

  useEffect(() => {
    if (typeof homePageDataset !== 'undefined' || homePageDataset !== {}) {
      const homePagesKeys = Object.keys(homePageDataset)
      const tempHomePagesArray = homePagesKeys.map(currentKey => homePageDataset[currentKey])
      setHomePages(tempHomePagesArray)
    }

    if (typeof spotDataset !== 'undefined' || spotDataset !== {}) {
      const spotsKeys = Object.keys(spotDataset)
      const tempSpotsArray = spotsKeys.map(currentKey => spotDataset[currentKey])
      setSpots(tempSpotsArray)
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

  return (
    <>
      <Head />
      <Box className={classes.mainContainer}>
        <Box className={classes.continentContainer}>
          <Typography>Destinations</Typography>
          {spots
            ?.filter(spot => spot.publication.website !== 'false')
            // Grouper par metaContinent
            .reduce(
              (acc, { meta_continent: metaContinentArray, target_url: targetUrl, ...rest }) => {
                // Vérifier si metaContinentArray est défini et a une valeur à l'index 0
                if (metaContinentArray && metaContinentArray.length > 0) {
                  const metaContinent = metaContinentArray[0]
                  if (!acc[metaContinent]) {
                    acc[metaContinent] = []
                  }
                  acc[metaContinent].push({ metaContinent, targetUrl, ...rest })
                }
                return acc
              },
              {}
            )
            // Convertir l'objet en tableau pour le tri
            .map(metaContinent => ({ metaContinent, groupedSpots: acc[metaContinent] }))
            // Trier par metaContinent si nécessaire
            .sort((a, b) => a.metaContinent - b.metaContinent)
            .map(({ metaContinent, groupedSpots }) => (
              <div key={metaContinent}>
                <Typography variant="h6">{metaContinentRef[metaContinent]}</Typography>
                {groupedSpots.map(({ targetUrl, title }) => (
                  <Link key={targetUrl} href={targetUrl} passHref className={classes.nextLink}>
                    <Typography>{title}</Typography>
                  </Link>
                ))}
              </div>
            ))}
        </Box>
        <Box className={classes.articlesContainer}>
          <Typography>Articles</Typography>
        </Box>
      </Box>
    </>
  )
}

export default SitePlan
