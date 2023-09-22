import { Box, Button, Typography, useMediaQuery } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import Image from 'next/image'
import Link from 'next/link'

import illustrationPlanning from '../../images/ILLUSTRATION_PLANNING_1.png'
import logo from '../../images/icons/logo.svg'

const useStyles = makeStyles(theme => ({
  buttonPrimary: {
    padding: `${theme.spacing(2.5)} 25px`,
    borderRadius: '50px',
    boxShadow: '0 3px 15px 0 #009D8C33',
    textTransform: 'none',
  },
  nextLink: {
    textDecoration: 'none',
  },
}))
const CTA = ({ imageDisplayed }) => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <Box sx={{ display: !matchesXs ? 'flex' : 'block', justifyContent: 'space-between' }}>
      <Box>
        <Typography
          variant="h6"
          color="primary.ultraDark"
          fontWeight="400"
          sx={{ marginBottom: '20px' }}
        >
          Inspiré ?
        </Typography>
        <Typography variant="h1" component="h3" sx={{ marginBottom: '20px' }}>
          Prépares ton séjour avec Explomaker
        </Typography>
        <Typography sx={{ marginBottom: '50px' }}>
          Créé gratuitement ton séjour sur Explomaker ! L’outil collaboratif complet qui
          t’accompagne avant, pendant et après ton séjour.
        </Typography>
        <Link
          passHref
          href="https://app.explomaker.fr"
          target="_blank"
          className={classes.nextLink}
        >
          <Button
            startIcon={
              <Image
                src={logo}
                height={25}
                width={20}
                alt="main_icon"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            }
            variant="contained"
            className={classes.buttonPrimary}
            sx={{ marginBottom: matchesXs && '60px' }}
          >
            Créer un séjour
          </Button>
        </Link>
      </Box>
      {imageDisplayed && (
        <Image
          src={illustrationPlanning}
          width={matchesXs ? '360' : '537'}
          quality={100}
          alt="planning_illustration"
          style={{
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      )}
    </Box>
  )
}
export default CTA
