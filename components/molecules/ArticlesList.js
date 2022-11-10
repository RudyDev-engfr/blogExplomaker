import { useMediaQuery } from '@mui/material'
import Box from '@mui/material/Box'
import { makeStyles, useTheme } from '@mui/styles'
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
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box
      display="grid"
      sx={{
        gridTemplate: !matchesXs
          ? 'repeat(auto-fill, 360px) / repeat(3, 1fr)'
          : 'repeat(auto-fill, 360px) / 1fr',
      }}
    >
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
                type_d_article: category,
              }) => (
                <MobileBlogCard
                  srcImg={picture}
                  targetLink={targetUrl}
                  title={titre}
                  key={objectID}
                  category={category.length > 0 ? category : 'Demacia'}
                  // commentsCount={Math.floor(Math.random() * 100)}
                  // likesCount={Math.floor(Math.random() * 100)}
                  publishDate={publishDate}
                  readingTime={readingTime}
                  slug={slug}
                  is360px={!matchesXs}
                  className={classes.mobileBlogCardAndCountryTile}
                  isSmallSize={isSmallSize}
                  isAlgolia={isAlgolia}
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
                  srcImg={pictureMain.src?.original}
                  link={targetUrl}
                  title={title}
                  key={targetUrl}
                  publishDate={creationDate ?? '17 Déc 2020 | 6min'}
                  is360px={!matchesXs}
                  className={classes.mobileBlogCardAndCountryTile}
                  isSmallSize={isSmallSize}
                  slug={slug}
                  isAlgolia={isAlgolia}
                />
              )
            )}
    </Box>
  )
}
export default ArticlesList
