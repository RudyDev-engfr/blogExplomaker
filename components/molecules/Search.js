import { useState, useEffect, useContext, useCallback } from 'react'

import { useHits } from 'react-instantsearch-hooks-web'

import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/styles'
import makeStyles from '@mui/styles/makeStyles'

import { SessionContext } from '../../contexts/session'
import MobileSearch from './MobileSearch'
import DesktopSearch from './DesktopSearch'

const Search = ({ modalState, modalStateSetter }) => {
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  const { setCurrentHitsArray } = useContext(SessionContext)
  const [currentSpots, setCurrentSpots] = useState([])
  const [currentArticles, setCurrentArticles] = useState([])
  const [isShowingMoreSpots, setIsShowingMoreSpots] = useState(false)
  const [isShowingMoreArticles, setIsShowingMoreArticles] = useState(false)

  // const [currentSort, setCurrentSort] = useState('pertinence')

  const transformItems = useCallback(
    spotsAndArticles =>
      spotsAndArticles.map(spotOrArticle => ({
        ...spotOrArticle,
      })),
    []
  )
  const { hits } = useHits({ transformItems })
  // console.log('hits', hits)
  // console.log(typeof hits)
  useEffect(() => {
    const hitsKeys = Object.keys(hits)
    const hitsArray = hitsKeys.map(key => hits[key])
    if (typeof hitsArray !== 'undefined') {
      setCurrentSpots(hitsArray.filter(hit => hit.resultats === 'Destinations'))
      setCurrentArticles(hitsArray.filter(hit => hit.resultats === 'Articles'))
      setCurrentHitsArray(hitsArray)
    }
  }, [hits, setCurrentHitsArray])

  if (matchesXs) {
    return (
      <MobileSearch
        modalState={modalState}
        modalStateSetter={modalStateSetter}
        currentSpots={currentSpots}
        currentArticles={currentArticles}
        isShowingMoreSpots={isShowingMoreSpots}
        setIsShowingMoreSpots={setIsShowingMoreSpots}
        isShowingMoreArticles={isShowingMoreArticles}
        setIsShowingMoreArticles={setIsShowingMoreArticles}
      />
    )
  }
  if (!matchesXs) {
    return (
      <DesktopSearch
        currentSpots={currentSpots}
        currentArticles={currentArticles}
        isShowingMoreSpots={isShowingMoreSpots}
        setIsShowingMoreSpots={setIsShowingMoreSpots}
        isShowingMoreArticles={isShowingMoreArticles}
        setIsShowingMoreArticles={setIsShowingMoreArticles}
        modalStateSetter={modalStateSetter}
        modalState={modalState}
      />
    )
  }
}
export default Search
