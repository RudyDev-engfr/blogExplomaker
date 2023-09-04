import { useMediaQuery } from '@mui/material'
import Box from '@mui/material/Box'
import { makeStyles, useTheme } from '@mui/styles'
import { useEffect } from 'react'

import MobileBlogCard from './MobileBlogCard'

const useStyles = makeStyles({
  mobileBlogCardAndCountryTile: {
    margin: '0 0 0 0',
  },
})
const ArticlesList = ({
  data,
  isShowingMoreArticles,
  numberOfArticles = 2,
  isAlgolia = false,
  numberOfMaxArticles = 29,
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box
      display="grid"
      sx={{
        gridTemplate: !matchesXs
          ? 'repeat(auto-fill, 300px) / repeat(3, 1fr)'
          : 'repeat(auto-fill, 300px) / 1fr',
        justifyItems: matchesXs && 'center',
        gridGap: '15px',
        paddingTop: '15px',
      }}
    >
      {isAlgolia
        ? data
            .filter((article, index) =>
              isShowingMoreArticles ? index <= numberOfMaxArticles : index <= numberOfArticles - 1
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
                sub_type: subType,
              }) => (
                <MobileBlogCard
                  srcImg={pictureMain.src?.original}
                  targetLink={targetUrl}
                  title={title}
                  key={targetUrl}
                  publishDate={creationDate ?? '17 Déc 2020 | 6min'}
                  is360px={!matchesXs}
                  className={classes.mobileBlogCardAndCountryTile}
                  slug={slug}
                  isAlgolia={isAlgolia}
                  category={subType[0].name}
                />
              )
            )}
    </Box>
  )
}
export default ArticlesList
