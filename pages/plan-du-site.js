import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import { makeStyles } from '@mui/styles'
import { database } from '../lib/firebase'

const getServerSideProps = async () => {
  const doc = await database.ref().child(`content`).get()
  const homePagesDoc = await database.ref().child(`page_structure/home_pages`).get()
  let dataset
  let spotDataset
  let articleDataset
  let homePageDataset
  if (doc.exists() && homePagesDoc.exists()) {
    dataset = doc.val()
    homePageDataset = homePagesDoc.val()
    spotDataset = dataset.spots
    articleDataset = dataset.post

    return {
      props: { homePageDataset, spotDataset, articleDataset },
      revalidate: 1,
    }
  }
}

const useStyles = makeStyles(theme => ({
  mainContainer: {
    width: '1140px',
    margin: 'auto',
    paddingTop: '115px',
  },
}))

const SitePlan = ({ homePageDataset, spotDataset, articleDataset }) => {
  const classes = useStyles()

  useEffect(() => {
    console.log('homePageDataset', homePageDataset)
    console.log('spotDataset', spotDataset)
    console.log('articleDataset', articleDataset)
  }, [homePageDataset, spotDataset, articleDataset])

  return <Box className={classes.mainContainer}>ok</Box>
}

export default SitePlan
