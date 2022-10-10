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

const ButtonBookmark = ({ spotSlug }) => {
  const classes = useStyles()
  const { user, spotsBookmarkedUpdate, setIsAuthModalOpen } = useContext(SessionContext)

  return (
    <IconButton
      disableElevation
      variant="contained"
      className={clsx(classes.buttonLike, {
        [classes.bookmarkedColors]: user?.spotsLiked?.includes(spotSlug),
      })}
      onClick={() => {
        if (user?.isLoggedIn) {
          spotsBookmarkedUpdate(spotSlug)
        } else {
          setIsAuthModalOpen('login')
        }
      }}
    >
      {user?.spotsBookmarked?.includes(spotSlug) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
    </IconButton>
  )
}
export default ButtonBookmark
