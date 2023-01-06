import { useContext } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite'
import Button from '@mui/material/Button'
import makeStyles from '@mui/styles/makeStyles'
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
  likedColors: {
    backgroundColor: '#FBEAEA',
    color: theme.palette.secondary.likes,
    '&:hover': {
      backgroundColor: '#FBEAEA',
    },
  },
}))

const ButtonLike = ({
  isLiked,
  likesCount = '0',
  isSpots = false,
  spotSlug,
  isArticle,
  articleSlug,
}) => {
  const { user, spotsLikedUpdate, setIsAuthModalOpen, articlesLikedUpdate } =
    useContext(SessionContext)

  const classes = useStyles()

  return isSpots || isArticle ? (
    <Button
      disableElevation
      variant="contained"
      startIcon={<FavoriteIcon />}
      className={clsx(classes.buttonLike, {
        [classes.likedColors]:
          user?.spotsLiked?.includes(spotSlug) || user?.articlesLiked.includes(articleSlug),
      })}
      onClick={() => {
        if (isSpots) {
          if (user?.isLoggedIn) {
            spotsLikedUpdate(spotSlug)
          } else {
            setIsAuthModalOpen('login')
          }
        }
        if (isArticle) {
          if (user?.isLoggedIn) {
            articlesLikedUpdate(articleSlug)
          } else {
            setIsAuthModalOpen('login')
          }
        }
      }}
    >
      {likesCount}
    </Button>
  ) : (
    <Button
      disableElevation
      variant="contained"
      startIcon={<FavoriteIcon />}
      className={clsx(classes.buttonLike, { [classes.likedColors]: isLiked })}
    >
      {likesCount}
    </Button>
  )
}

export default ButtonLike
