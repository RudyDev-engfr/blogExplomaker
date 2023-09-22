import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import IconButton from '@mui/material/IconButton'
import { useMediaQuery, useTheme } from '@mui/material'
import Flight from '@mui/icons-material/Flight'
import Copyright from '@mui/icons-material/Copyright'
import Facebook from '@mui/icons-material/Facebook'
import Divider from '@mui/material/Divider'
import makeStyles from '@mui/styles/makeStyles'
import { useRouter } from 'next/dist/client/router'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  footer: {
    backgroundColor: theme.palette.primary.ultraDark,
    color: theme.palette.primary.contrastText,
    [theme.breakpoints.down('sm')]: {
      padding: '45px',
    },
  },
  footerLink: {
    color: theme.palette.primary.contrastText,
    padding: '5px 0',
  },
  page404: {
    marginTop: '-145px',
  },
  footerTitle: {
    fontSize: '22px',
    fontWeight: '500',
  },
}))

const Footer = () => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const router = useRouter()

  return (
    <Paper
      square
      elevation={0}
      className={clsx(classes.footer, { [classes.page404]: router.pathname === '/404' })}
      sx={{
        display:
          (router.pathname === '/inspiration' && matchesXs) ||
          router.pathname === '/favorites' ||
          router.pathname.includes('/exploration') ||
          (router.pathname.includes('/spot') && matchesXs)
            ? 'none'
            : 'block',
      }}
    >
      <Box
        component="footer"
        maxWidth="1200px"
        m="auto"
        py={matchesXs ? 0 : 10}
        marginBottom={matchesXs && '60px'}
      >
        <Grid container spacing={4} mb={3}>
          <Grid item md={3} sm={12}>
            <Typography variant="h4" className={classes.footerTitle}>
              Explomaker
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: '24px', marginBottom: '30px' }}>
              EXPLOMAKER est une enseigne Digital Project &amp; Transformation Consulting
              immatriculé au RCS Orléans N°833 831 779 00016
            </Typography>
            <Box sx={{ position: 'relative' }}>
              <Box
                sx={{
                  height: '45px',
                  width: '45px',
                  backgroundColor: 'rgba(256, 256, 256, 0.1)',
                  borderRadius: '5px',
                  [theme.breakpoints.down('sm')]: {
                    marginBottom: '60px',
                  },
                }}
              />
              <Link
                component={IconButton}
                href="https://www.facebook.com/explomaker/"
                sx={{
                  position: 'absolute',
                  top: '0',
                  width: '45px',
                  height: '45px',
                  borderRadius: '5px',
                }}
              >
                <Facebook sx={{ opacity: '100%', color: 'white' }} />
              </Link>
            </Box>
          </Grid>
          <Grid item md={3} xs={4}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              marginBottom={matchesXs && '60px'}
            >
              <Typography variant="h4">Ressources</Typography>
              <Link variant="body2" href="https://explomaker.fr" className={classes.footerLink}>
                Présentation de l&rsquo;app
              </Link>
              <Link variant="body2" href="/fonctionnement" className={classes.footerLink}>
                Fonctionnement de l&rsquo;app
              </Link>
              <Link variant="body2" href="/demarrage" className={classes.footerLink}>
                Débuter avec Explomaker
              </Link>
              <Link
                variant="body2"
                href="https://app.explomaker.fr/help"
                className={classes.footerLink}
              >
                Aide
              </Link>
              <Link variant="body2" href="https://explomaker.fr/cgu" className={classes.footerLink}>
                Conditions générales
              </Link>
            </Box>
          </Grid>
          <Grid item md={3} xs={4}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              marginBottom={matchesXs && '20px'}
            >
              <Typography variant="h4" className={classes.footerTitle}>
                <Link
                  href="exploration?SearchFront%5BrefinementList%5D%5Bresultats%5D%5B0%5D=Articles"
                  className={classes.footerLink}
                  underline="none"
                  rel="nofollow"
                >
                  Le blog Explomaker
                </Link>
              </Typography>
              <Link
                variant="body2"
                href="/exploration?SearchFront%5BrefinementList%5D%5Btype_d_article%5D%5B0%5D=Actualit%C3%A9s"
                className={classes.footerLink}
                rel="nofollow"
              >
                Actualités
              </Link>
              <Link
                variant="body2"
                href="/exploration?SearchFront%5BrefinementList%5D%5Btype_d_article%5D%5B0%5D=Inspiration"
                className={classes.footerLink}
                rel="nofollow"
              >
                Inspiration
              </Link>
              <Link
                variant="body2"
                href="/exploration?SearchFront%5BrefinementList%5D%5Btype_d_article%5D%5B0%5D=Exploration"
                className={classes.footerLink}
                rel="noffollow"
              >
                Exploration
              </Link>
              <Link
                variant="body2"
                href="/exploration?SearchFront%5BrefinementList%5D%5Btype_d_article%5D%5B0%5D=Pr%C3%A9paration+de+voyage"
                className={classes.footerLink}
                rel="nofollow"
              >
                Préparation de voyage
              </Link>
              <Link
                variant="body2"
                href="/exploration?SearchFront%5BrefinementList%5D%5Btype_d_article%5D%5B0%5D=R%C3%A9cits+de+voyages"
                className={classes.footerLink}
                rel="nofollow"
              >
                Récits de voyages
              </Link>
            </Box>
          </Grid>
          <Grid item md={3} xs={4}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              marginBottom={matchesXs && '60px'}
            >
              <Typography variant="h4" className={classes.footerTitle}>
                Contact
              </Typography>
              <Link href="/crash" variant="body2" className={classes.footerLink} rel="nofollow">
                Une erreur sur l&rsquo;app ?
              </Link>
              <Link href="/contact" variant="body2" className={classes.footerLink} rel="nofollow">
                Contact rapide
              </Link>
              <Link variant="body2" href="/recrutement" className={classes.footerLink}>
                Recrutement
              </Link>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ bgcolor: theme.palette.secondary.contrastText, margin: '22px 0' }} />
        <Box display="inline-flex" alignItems="center" color="white">
          <Flight fontSize="small" style={{ transform: 'rotate(45deg)' }} />
          <Copyright fontSize="small" />
          <Box ml={1}>
            <Typography variant="caption">2023 Explomaker. Tous droits réservés.</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

export default Footer
