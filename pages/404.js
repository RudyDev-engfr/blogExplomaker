import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import Image from 'next/image'
import { useRouter } from 'next/router'

import background404 from '../images/ILLUSTRATION_COMPLETE.png'

const useStyles = makeStyles(theme => ({
  fullWidthContainer: {
    width: '100%',
    height: '100vh',
    position: 'relative',
  },
  mainContainer: {
    maxWidth: '1140px',
    margin: 'auto',
    paddingTop: '200px',
  },
  textContainer: {
    maxWidth: '477px',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '65px',
      position: 'relative',
      top: '-145px',
    },
  },
  lostTitle: {
    fontSize: '54px',
    lineHeight: '64px',
    fontWeight: '700',
    marginBottom: '10px',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '5px',
    },
  },
  lostText: {
    marginBottom: '40px',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '50px',
    },
  },
  lostButtonHome: {
    padding: '20px 50px 20px 50px',
    marginRight: '20px',
    borderRadius: '50px',
    height: '64px',
    textTransform: 'none',
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
    fontWeight: '500',
    fontSize: '20px',
    lineHeight: '34px',
    textAlign: 'center',
    color: theme.palette.secondary.contrastText,
  },
  lostButtonBack: {
    border: '1px solid #4F4F4F',
    height: '64px',
    padding: '20px 50px 20px 50px',
    borderRadius: '50px',
    color: theme.palette.grey['4f'],
    fontWeight: '500',
    fontSize: '20px',
    lineHeight: '34px',
    textAlign: 'center',
    textTransform: 'none',
  },

  imageContainer: {
    position: 'relative',
    width: '450px',
    height: '450px',
  },
  mobileImageContainer: {
    width: '100vw',
    minHeight: '570px',
    maxHeight: '100vh',
    position: 'relative',
    top: '-145px',
    backgroundSize: 'contain',
    objectPosition: 'center',
    background: 'no-repeat url(../images/ILLUSTRATION_COMPLETE.png) ',
  },
  itemsContainer: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // Responsive part
  mobileSizing: {
    [theme.breakpoints.down('sm')]: {
      width: '90%',
      margin: 'auto',
    },
  },
}))
const ErrorPage = () => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const router = useRouter()

  const redirectHome = () => {
    router.push('/')
  }

  const handleReturn = () => {
    router.back()
  }

  return matchesXs ? (
    <>
      <Box position="relative">
        <Box className={classes.mobileImageContainer} />
      </Box>
      <Box className={classes.mobileSizing}>
        <Box className={classes.textContainer}>
          <Box>
            <Typography variant="h1" component="h2" className={classes.lostTitle}>
              Erreur 404
            </Typography>
            <Typography className={classes.lostText}>
              Cher explorateur, tu as essayé d’atteindre une terre inconnue. C’est ambitieux mais
              hélas, il n’y a rien à voir ici. Pas d’inquiétude, on va t’aiguiller !
            </Typography>
            <Box marginBottom="20px">
              <Button className={classes.lostButtonHome} onClick={redirectHome}>
                Page d&rsquo;accueil
              </Button>
            </Box>
            <Button className={classes.lostButtonBack} onClick={handleReturn}>
              Retour
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  ) : (
    <Box className={classes.fullWidthContainer}>
      <Box className={classes.mainContainer}>
        <Box className={classes.itemsContainer}>
          <Box className={classes.imageContainer}>
            <Image alt="error background" src={background404} quality={100} fill sizes="100vw" />
          </Box>
          <Box className={classes.textContainer}>
            <Box>
              <Typography variant="h1" component="h2" className={classes.lostTitle}>
                Erreur 404
              </Typography>
              <Typography className={classes.lostText}>
                Cher explorateur, tu as essayé d’atteindre une terre inconnue. C’est ambitieux mais
                hélas, il n’y a rien à voir ici. Pas d’inquiétude, on va t’aiguiller !
              </Typography>
              <Box display="flex" justifyContent="flex-start">
                <Button className={classes.lostButtonHome} onClick={redirectHome}>
                  Page d&rsquo;accueil
                </Button>
                <Button className={classes.lostButtonBack} onClick={handleReturn}>
                  Retour
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
export default ErrorPage
