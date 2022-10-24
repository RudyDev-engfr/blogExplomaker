import Box from '@mui/material/Box'
import { makeStyles } from '@mui/styles'
import { useEffect } from 'react'

import MobileBlogCard from './MobileBlogCard'

const useStyles = makeStyles({
  mobileBlogCardAndCountryTile: {
    margin: '30px 0 30px 0',
  },
})
const ArticlesList = ({
  data,
  isShowingMoreArticles,
  isSmallSize = false,
  numberOfArticles = 2,
  isAlgolia = false,
}) => {
  const classes = useStyles()

  return (
    <Box display="flex" justifyContent="space-between" flexWrap="wrap">
      {isAlgolia
        ? data
            .filter((article, index) =>
              isShowingMoreArticles ? index <= 29 : index <= numberOfArticles - 1
            )
            .map(
              ({
                titre,
                picture,
                url_link: targetUrl,
                temps_de_lecture: readingTime,
                objectID,
              }) => (
                <MobileBlogCard
                  srcImg={picture}
                  link={targetUrl}
                  title={titre}
                  key={objectID}
                  // commentsCount={Math.floor(Math.random() * 100)}
                  // likesCount={Math.floor(Math.random() * 100)}
                  publishDate={`17 Déc 2020 | ${readingTime}`}
                  isResult
                  className={classes.mobileBlogCardAndCountryTile}
                  isSmallSize={isSmallSize}
                />
              )
            )
        : data
            .filter((article, index) =>
              isShowingMoreArticles ? true : index <= numberOfArticles - 1
            )
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
