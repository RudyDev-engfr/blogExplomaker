import { useCallback, useEffect, useState } from 'react'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { makeStyles } from '@mui/styles'

import qs from 'qs'

import { RefinementList, SearchBox, useHits } from 'react-instantsearch-hooks-web'
import { Panel } from 'react-instantsearch-dom'

import ArticlesList from '../components/molecules/ArticlesList'
import SpotList from '../components/molecules/SpotList'
import { database } from '../lib/firebase'

const useStyles = makeStyles({
  spotResultContainer: {
    width: '100%',
    display: 'grid',
    gridTemplate: '1fr / 1fr 1fr 1fr 1fr',
    gridGap: '30px',
    paddingBottom: '60px',
    paddingLeft: '30px',
  },
})

const NewSearch = () => {
  const classes = useStyles()
  const [isShowingArticles, setIsShowingArticles] = useState(false)
  const [isShowingAllSpots, setIsShowingAllSpots] = useState(false)
  const [currentHitsArray, setcurrentHitsArray] = useState([])

  const transformItems = useCallback(
    spotsAndArticles =>
      spotsAndArticles.map(spotOrArticle => ({
        ...spotOrArticle,
      })),
    []
  )
  const { hits } = useHits({ transformItems })
  console.log('hits', hits)
  console.log(typeof hits)
  useEffect(() => {
    const hitsKeys = Object.keys(hits)
    const hitsArray = hitsKeys.map(key => hits[key])
    if (typeof hitsArray !== 'undefined') {
      setcurrentHitsArray(hitsArray)
    }
  }, [hits])

  return (
    <Box marginTop="100px">
      <SearchBox />
      <Panel header="Types de séjours">
        <RefinementList attribute="type_de_sejour" searchable={false} limit={10} />
      </Panel>
      <Panel header="Envies">
        <RefinementList attribute="envies" searchable={false} limit={10} />
      </Panel>
      <Panel header="En direction de">
        <RefinementList attribute="en_direction_de" searchable={false} limit={10} />
      </Panel>
      <ArticlesList
        data={currentHitsArray.filter(hit => hit.resultats === 'Articles')}
        isShowingArticles={isShowingArticles}
        numberOfArticles={8}
        isAlgolia
      />
      <Box className={classes.spotResultContainer}>
        <SpotList
          data={currentHitsArray.filter(hit => hit.resultats === 'Destinations')}
          isShowingAllSpots={isShowingAllSpots}
          isAlgolia
          numberOfSpots={4}
        />
        <Button
          onClick={() => {
            setIsShowingAllSpots(true)
          }}
        >
          Voir tout
        </Button>
      </Box>
    </Box>
  )
}

const TestAlgolia = () => {
  const classes = useStyles()

  return <NewSearch />
}
export default TestAlgolia
