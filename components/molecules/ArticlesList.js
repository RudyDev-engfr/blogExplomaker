import Box from '@mui/material/Box'
import { makeStyles } from '@mui/styles'
import { useEffect } from 'react'

import MobileBlogCard from './MobileBlogCard'

const useStyles = makeStyles({
  mobileBlogCardAndCountryTile: {
    margin: '30px 0 0 0',
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
                date_de_publication: publishDate,
                objectID,
                slug,
              }) => (
                <MobileBlogCard
                  srcImg={picture}
                  targetLink={targetUrl}
                  title={titre}
                  key={objectID}
                  // commentsCount={Math.floor(Math.random() * 100)}
                  // likesCount={Math.floor(Math.random() * 100)}
                  publishDate={publishDate}
                  readingTime={readingTime}
                  slug={slug}
                  is360px
                  className={classes.mobileBlogCardAndCountryTile}
                  isSmallSize={isSmallSize}
                  isAlgolia
                />
              )
            )
        : data
            .filter((article, index) =>
              isShowingMoreArticles ? true : index <= numberOfArticles - 1
            )
            .map(
              ({
                title,
                picture: pictureMain,
                target_url: targetUrl,
                creation_date: creationDate,
                slug,
              }) => (
                <MobileBlogCard
                  srcImg={`https://storage.googleapis.com/stateless-www-explomaker-fr/${pictureMain.src?.original}`}
                  link={targetUrl}
                  title={title}
                  key={targetUrl}
                  publishDate={creationDate ?? '17 Déc 2020 | 6min'}
                  is360px
                  className={classes.mobileBlogCardAndCountryTile}
                  isSmallSize={isSmallSize}
                  slug={slug}
                />
              )
            )}
    </Box>
  )
}
export default ArticlesList
