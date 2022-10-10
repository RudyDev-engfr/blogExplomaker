import Box from '@mui/material/Box'
import { makeStyles } from '@mui/styles'
import { useEffect } from 'react'

import MobileBlogCard from './MobileBlogCard'

const useStyles = makeStyles({
  mobileBlogCardAndCountryTile: {
    margin: '30px 0 30px 0',
  },
})
const ArticlesList = ({ data, isShowingAllArticles, isSmallSize = false }) => {
  const classes = useStyles()

  useEffect(() => {
    console.log('data', data)
  }, [])

  return (
    <Box display="flex" justifyContent="space-between" flexWrap="wrap">
      {data
        .filter((article, index) => (isShowingAllArticles ? true : index <= 2))
        .map(({ title, picture: pictureMain, target_url: targetUrl }) => (
          <MobileBlogCard
            srcImg={`https://storage.googleapis.com/stateless-www-explomaker-fr/${pictureMain.src?.original}`}
            link={targetUrl}
            title={title}
            key={targetUrl}
            commentsCount={Math.floor(Math.random() * 100)}
            likesCount={Math.floor(Math.random() * 100)}
            publishDate="17 Déc 2020 | 6min"
            isResult
            className={classes.mobileBlogCardAndCountryTile}
            isSmallSize={isSmallSize}
          />
        ))}
    </Box>
  )
}
export default ArticlesList
