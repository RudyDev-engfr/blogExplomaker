import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import WPGBlocks from 'react-gutenberg'
import 'react-gutenberg/default.css'

import { testArticle } from '../../helper/testArticle'
import { database } from '../../lib/firebase'

export async function getStaticPaths() {
  return {
    paths: [
      {
        params: {
          slug: '10-mega-bonnes-raisons-denvoyer-une-carte-postale-pendant-ton-voyage-a-vos-amis-ou-collegues',
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
  return (
    <Box
      sx={{
        width: '1000px',
        margin: 'auto',
        marginTop: '125px',
      }}
    >
      <Typography variant="h1" align="center">
        Salut
      </Typography>
      <WPGBlocks blocks={testArticle.blocks} />
    </Box>
  )
}
