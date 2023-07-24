import { useContext } from 'react'
import IconButton from '@mui/material/IconButton'
import makeStyles from '@mui/styles/makeStyles'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import clsx from 'clsx'

import { SessionContext } from '../../contexts/session'

const useStyles = makeStyles(theme => ({
  buttonLike: {
    fontSize: '14px',
    height: '40px',
    color: theme.palette.grey['4f'],
    backgroundColor: theme.palette.grey.f7,
    borderRadius: '40px',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
}))

const ButtonBookmark = ({ spotSlug, articleSlug, isArticle = false, isSpot = false }) => {
  const classes = useStyles()
  const { user, spotsBookmarkedUpdate, setIsAuthModalOpen, articlesBookmarkedUpdate } =
    useContext(SessionContext)

  return (
    <IconButton
      variant="contained"
      className={clsx(classes.buttonLike, {
        [classes.bookmarkedColors]: user?.spotsLiked?.includes(spotSlug),
      })}
      onClick={() => {
        if (isSpot) {
          if (user?.isLoggedIn) {
            spotsBookmarkedUpdate(spotSlug)
          } else {
            setIsAuthModalOpen('login')
          }
        }
        if (isArticle) {
          if (user?.isLoggedIn) {
            articlesBookmarkedUpdate(articleSlug)
          } else {
            setIsAuthModalOpen('login')
          }
        }
      }}
    >
      {isSpot &&
        (user?.spotsBookmarked?.includes(spotSlug) ? <BookmarkIcon /> : <BookmarkBorderIcon />)}
      {isArticle &&
        (user?.articlesBookmarked?.includes(articleSlug) ? (
          <BookmarkIcon />
        ) : (
          <BookmarkBorderIcon />
        ))}
    </IconButton>
  )
}
export default ButtonBookmark
