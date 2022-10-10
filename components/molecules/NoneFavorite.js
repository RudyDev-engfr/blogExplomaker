import BookmarkTwoTone from '@mui/icons-material/BookmarkTwoTone'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import makeStyles from '@mui/styles/makeStyles'
import clsx from 'clsx'
import { useTheme } from '@mui/material'

const useStyles = makeStyles(theme => ({
  mainCardSpot: {
    width: '263px',
    height: '350px',
    borderRadius: '20px',
    padding: '47px 20px 37px 20px',
    display: 'grid',
    backgroundColor: theme.palette.grey.f2,
    gridTemplates: '1fr 1fr 1fr / 1fr',
    justifyItems: 'center',
    textAlign: 'center',
    marginBottom: '80px',
    [theme.breakpoints.down('sm')]: {
      width: '230px',
      height: '305px',
      maxWidth: '75%',
    },
  },
  mainCardArticle: {
    width: '360px',
    height: '321px',
    borderRadius: '20px',
    padding: '47px 20px 37px 20px',
    display: 'grid',
    backgroundColor: theme.palette.grey.f2,
    gridTemplates: '1fr 1fr 1fr / 1fr',
    justifyItems: 'center',
    textAlign: 'center',
    marginBottom: '80px',
    [theme.breakpoints.down('sm')]: {
      width: '315px',
      height: '293px',
      maxWidth: '95%',
    },
  },
}))
const NoneFavorite = ({ isArticle, isSpot }) => {
  const classes = useStyles()
  const theme = useTheme()

  return (
    <>
      <Box
        className={clsx({ [classes.mainCardSpot]: isSpot, [classes.mainCardArticle]: isArticle })}
      >
        <BookmarkTwoTone
          sx={{
            fontSize: '40px',
            color: theme.palette.secondary.contrastText,
            '& svg path:nth-child(1)': {
              filter:
                'invert(47%) sepia(34%) saturate(4624%) hue-rotate(163deg) brightness(97%) contrast(101%)',
            },
            '& svg path:nth-child(2)': {
              filter:
                'invert(47%) sepia(34%) saturate(4624%) hue-rotate(163deg) brightness(97%) contrast(101%)',
            },
          }}
        />
        <Typography variant="h6" component="h3" color={theme.palette.grey.grey33}>
          Aucun Favori
        </Typography>
        <Typography>
          Ajoutes des {isSpot && 'spots'} {isArticle && 'articles'} en favoris pour les retrouver
          ici
        </Typography>
      </Box>
    </>
  )
}
export default NoneFavorite
